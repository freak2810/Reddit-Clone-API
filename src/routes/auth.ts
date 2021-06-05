import { Request, Response, Router } from 'express';
import User from '../entities/User';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import auth from '../middleware/auth';
import user from '../middleware/user';

const mapErrors = (errors: Object[]) =>
	errors.reduce((prev: any, err: any) => {
		prev[err.property] = Object.entries(err.constraints)[0][1];
		return prev;
	}, {});

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		let errors: any = {};

		const emailExists = await User.findOne({ email });
		const usernameExists = await User.findOne({ username });

		console.log(usernameExists);

		if (emailExists) {
			errors.email = 'Email Already Taken';
		}

		if (usernameExists) {
			errors.username = 'Username Already Exists';
		}

		if (Object.keys(errors).length > 0) {
			return res.status(400).json(errors);
		}

		const user = new User({ email, username, password });

		errors = await validate(user);

		if (errors.length > 0) return res.status(400).json(mapErrors(errors));

		await user.save();

		return res.json(user);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: 'Something went wrong', e });
	}
};

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const errors: any = {};

		if (isEmpty(username)) errors.username = 'Username must not be empty';
		if (isEmpty(password)) errors.password = 'Password must not be empty';

		if (Object.keys(errors).length > 0) {
			return res.status(400).json(errors);
		}

		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ username: 'User not found' });
		}

		const isPasswordMatches = await bcrypt.compare(password, user.password);

		if (!isPasswordMatches) {
			return res.status(401).json({ password: 'Password is incorrect' });
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET!);

		res.set(
			'Set-Cookie',
			cookie.serialize('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 3600,
				path: '/',
			})
		);

		return res.json(user);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: 'Something went wrong', e });
	}
};

const me = (_: Request, res: Response) => {
	return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
	res.set(
		'Set-Cookie',
		cookie.serialize('token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: new Date(0),
			path: '/',
		})
	);

	res.status(200).json({ success: true });
};

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', user, auth, me);
router.get('/logout', user, auth, logout);

export default router;
