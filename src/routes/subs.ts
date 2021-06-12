import { NextFunction, Request, Response, Router } from 'express';
import User from '../entities/User';
import auth from './auth';
import { isEmpty } from 'class-validator';
import { getRepository } from 'typeorm';
import Sub from '../entities/Sub';
import user from '../middleware/user';
import Post from '../entities/Post';
import { makeId } from '../utils/helpers';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import * as fs from 'fs';

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;

	const user: User = res.locals.user;

	try {
		const errors: any = {};

		if (isEmpty(name)) errors.name = 'Name must not be empty';
		if (isEmpty(title)) errors.name = 'Title must not be empty';

		const sub = await getRepository(Sub)
			.createQueryBuilder('sub')
			.where('lower(sub.name) = :name', { name: name.toLowerCase() })
			.getOne();

		if (sub) errors.name = 'Sub Exists already';

		if (Object.keys(errors).length > 0) throw errors;
	} catch (e) {
		return res.status(400).json(e);
	}

	try {
		const sub = new Sub({ name, description, title, user });
		await sub.save();
		return res.json(sub);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: 'Something went wrong', e });
	}
};

const getSub = async (req: Request, res: Response) => {
	const name = req.params.name;

	try {
		const sub = await Sub.findOneOrFail({ name });

		const posts = await Post.find({
			where: { sub },
			relations: ['comments', 'votes'],
			order: { createdAt: 'DESC' },
		});

		sub.posts = posts;

		if (res.locals.user) {
			sub.posts.forEach(p => p.setUserVote(res.locals.user));
		}

		return res.status(200).json(sub);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ sub: 'Sub not found', e });
	}
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user: User = res.locals.user;

	try {
		const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

		if (sub.username !== user.username) {
			return res.status(403).json({ error: 'You dont own this sub' });
		}

		res.locals.sub = sub;
		return next();
	} catch (e) {
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: 'public/images',
		filename: (_, file, callback) => {
			const name = makeId(15);
			callback(null, name + path.extname(file.originalname)); // e.g. jh34gh2v4y + .png
		},
	}),
	fileFilter: (_, file: any, callback: FileFilterCallback) => {
		if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
			callback(null, true);
		} else {
			callback(new Error('Not an image'));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	const sub: Sub = res.locals.sub;

	try {
		const type = req.body.type;

		if (type !== 'image' || type !== 'banner') {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({ error: 'Invalid type' });
		}

		let oldImageUrn = '';

		if (type === 'image') {
			oldImageUrn = sub.imageUrn || '';
			sub.imageUrn = req.file.filename;
		} else if (type === 'banner') {
			oldImageUrn = sub.bannerUrn || '';
			sub.bannerUrn = req.file.filename;
		}

		if (oldImageUrn !== '') {
			fs.unlinkSync(`public\\images\\${oldImageUrn}`);
		}

		await sub.save();
		return res.status(201).json(sub);
	} catch (e) {
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

const router = Router();

router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.post(
	'/:name/image',
	user,
	auth,
	ownSub,
	upload.single('file'),
	uploadSubImage
);

export default router;
