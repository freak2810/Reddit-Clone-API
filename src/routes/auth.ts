import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { validate } from 'class-validator';

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

		if (errors.length > 0) return res.status(400).json(errors);

		await user.save();

		return res.json(user);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: 'Something went wrong', e });
	}
};

const router = Router();

router.post('/register', register);

export default router;
