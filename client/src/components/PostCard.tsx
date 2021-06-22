import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { Post } from '../types';
import classNames from 'classnames';
import Image from 'next/image';
import ActionButton from './ActionButton';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';

interface PostCardProps {
	post: Post;
	revalidate?: () => void;
}

dayjs.extend(relativeTime);

export default function PostCard({
	post: {
		identifier,
		slug,
		body,
		title,
		subName,
		createdAt,
		voteScore,
		userVote,
		commentCount,
		url,
		username,
	},
	revalidate,
}: PostCardProps) {
	const { authenticated } = useAuthState();
	const router = useRouter();

	const vote = async (value: number) => {
		if (!authenticated) router.push('/login');

		if (value === userVote) value = 0;

		try {
			const res = await axios.post('/misc/vote', {
				identifier,
				slug,
				value,
			});

			if (revalidate) revalidate();
			// console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			key={identifier}
			className="flex mb-4 bg-white rounded"
			id={identifier}
		>
			{/* Vote Section */}
			<div className="w-10 py-3 text-center bg-gray-200 rounded-l">
				{/* Upvote */}
				<div
					className={classNames(
						'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500',
						{ 'text-red-500': userVote === 1 }
					)}
					onClick={() => vote(1)}
				>
					<i className="icon-arrow-up"></i>
				</div>
				<p className="text-xs font-bold">{voteScore}</p>
				{/* Downvote */}
				<div
					className={classNames(
						'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600',
						userVote === -1 && 'text-blue-600'
					)}
					onClick={() => vote(-1)}
				>
					<i className="icon-arrow-down"></i>
				</div>
			</div>
			<div className="w-full p-2">
				<div className="flex items-center">
					<Link href={`/r/${subName}`}>
						<Image
							height={24}
							width={24}
							src="https://i.pravatar.cc/24"
							className="rounded-full cursor-pointer"
						/>
					</Link>
					<Link href={`/r/${subName}`}>
						<a className="ml-1 text-xs font-bold cursor-pointer hover:underline ">
							/r/{subName}
						</a>
					</Link>
					<p className="text-xs text-gray-600">
						<span className="mx-1 text-gray-500">•</span>
						Posted by
						<Link href={`/u/${username}`}>
							<a className="mx-1 hover:underline">{`/u/${username}`}</a>
						</Link>
						<Link href={url}>
							<a className="mx-1 hover:underline">
								{dayjs(createdAt).fromNow()}
							</a>
						</Link>
					</p>
				</div>
				<Link href={url}>
					<a className="my-1 text-lg font-medium">{title}</a>
				</Link>
				{body && <p className="my-1 text-sm">{body}</p>}

				<div className="flex">
					<Link href={url}>
						<a className="">
							<ActionButton>
								<i className="mr-1 fas fa-comment-alt fa-xs"></i>
								<span className="font-bold">{commentCount} comments</span>
							</ActionButton>
						</a>
					</Link>
					<ActionButton>
						<i className="mr-1 fas fa-share fa-xs"></i>
						<span className="font-bold">Share</span>
					</ActionButton>
					<ActionButton>
						<i className="mr-1 fas fa-bookmark fa-xs"></i>
						<span className="font-bold">Save</span>
					</ActionButton>
				</div>
			</div>
		</div>
	);
}
