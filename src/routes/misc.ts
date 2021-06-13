import { Request, Response, Router } from 'express';
import auth from '../middleware/auth';
import User from '../entities/User';
import Post from '../entities/Post';
import Comment from '../entities/Comment';
import Vote from '../entities/Vote';
import user from '../middleware/user';
import { getConnection } from 'typeorm';
import Sub from '../entities/Sub';

const router = Router();

const vote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifier, value } = req.body;

	//Validate vote value
	if (![-1, 0, 1].includes(value))
		return res.status(400).json({ value: 'Value must be 0, -1 or 1' });

	try {
		const user: User = res.locals.user;
		let post = await Post.findOneOrFail({ identifier, slug });
		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifier) {
			//Find if the comment exists and  Find vote by comment
			comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
			vote = await Vote.findOne({ user, comment });
		} else {
			//Find vote by Post
			vote = await Vote.findOne({ user, post });
		}

		if (!vote && value === 0) {
			// If no vote & value is 0 -> return Error
			return res.status(404).json({ error: 'Vote not found' });
		} else if (!vote) {
			// If no vote ...  create it
			vote = new Vote({ user, value });

			if (comment) vote.comment = comment;
			else vote.post = post;

			await vote.save();
		} else if (value === 0) {
			// If vote exists and value = 0 .. remove vote from db

			await vote.remove();
		} else if (vote.value !== value) {
			// If vote exists and value has changed ... update the value
			vote.value = value;
			await vote.save();
		}

		post = await Post.findOneOrFail(
			{ identifier, slug },
			{ relations: ['comments', 'comments.votes', 'sub', 'votes'] }
		);

		post.setUserVote(user);
		post.comments.forEach(c => c.setUserVote(user));

		return res.json(post);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

const topSubs = async (_: Request, res: Response) => {
	try {
		const imageUrlExpr = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn", 'https://i.pravatar.cc/24')`;

		const subs = await getConnection()
			.createQueryBuilder()
			.select(
				`s.title, s.name, ${imageUrlExpr} as "imageUrl", count(p.id) as "postCount"`
			)
			.from(Sub, 's')
			.leftJoin(Post, 'p', `s.name = p."subName"`)
			.groupBy('s.title, s.name, "imageUrl"')
			.orderBy('"postCount"', 'DESC')
			.limit(5)
			.execute();

		return res.status(200).json(subs);
	} catch (e) {
		// console.log(e);
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

router.post('/vote', user, auth, vote);
router.get('/top-subs', topSubs);

export default router;
