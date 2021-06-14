import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Post } from '../../../../types';
import React from 'react';
import Sidebar from '../../../../components/Sidebar';
import classNames from 'classnames';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../../../context/auth';
import ActionButton from '../../../../components/ActionButton';

dayjs.extend(relativeTime);

export default function PostPage() {
	const router = useRouter();

	const { authenticated } = useAuthState();

	const { identifier, sub, slug } = router.query;

	const { data: post, error } = useSWR<Post>(
		identifier && slug ? `/posts/${identifier}/${slug}` : null
	);

	if (error) router.push('/');

	const vote = async (value: number) => {
		if (!authenticated) router.push('/login');

		// If vote is the same --> reset vote
		if (value === post.userVote) value = 0;

		try {
			await axios.post('/misc/vote', {
				identifier,
				slug,
				value,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Head>
				<title>{post?.title}</title>
			</Head>
			<Link href={`/r/${sub}`}>
				<a>
					<div className="flex items-center w-full h-20 p-8 bg-blue-500">
						<div className="container flex">
							{post && (
								<div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
									<Image src={post.sub.imageUrl} height={32} width={32} />
								</div>
							)}
							<p className="text-xl font-semibold text-white">/r/{sub}</p>
						</div>
					</div>
				</a>
			</Link>
			<div className="container flex pt-5">
				{/* post */}
				<div className="w-160">
					<div className="bg-white rounded">
						{post && (
							<div className="flex">
								{' '}
								{/* Vote Section */}
								<div className="w-10 py-3 text-center rounded-l">
									{/* Upvote */}
									<div
										className={classNames(
											'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500',
											{ 'text-red-500': post.userVote === 1 }
										)}
										onClick={() => vote(1)}
									>
										<i className="icon-arrow-up"></i>
									</div>
									<p className="text-xs font-bold">{post.voteScore}</p>
									{/* Downvote */}
									<div
										className={classNames(
											'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600',
											{ 'text-blue-600': post.userVote === -1 }
										)}
										onClick={() => vote(-1)}
									>
										<i className="icon-arrow-down"></i>
									</div>
								</div>
								<div className="p-2">
									<div className="flex items-center">
										<p className="text-xs text-gray-600">
											Posted by
											<Link href={`/u/${post.username}`}>
												<a className="mx-1 hover:underline">{`/u/${post.username}`}</a>
											</Link>
											<Link href={post.url}>
												<a className="mx-1 hover:underline">
													{dayjs(post.createdAt).fromNow()}
												</a>
											</Link>
										</p>
									</div>
									<h1 className="my-1 text-xl font-medium">{post.title}</h1>
									{/* Post Body */}
									<p className="my-3 text-sm">{post.body}</p>
									<div className="flex">
										<Link href={post.url}>
											<a className="">
												<ActionButton>
													<i className="mr-1 fas fa-comment-alt fa-xs"></i>
													<span className="font-bold">
														{post.commentCount} comments
													</span>
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
						)}
					</div>
				</div>
				{/* sidebar */}
				{post && <Sidebar sub={post.sub} />}
			</div>
		</>
	);
}
