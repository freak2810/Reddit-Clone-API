import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		axios
			.get('/posts')
			.then(res => setPosts(res.data))
			.catch(err => console.log(err));
	}, []);

	return (
		<div className="pt-12">
			<Head>
				<title>Reddit: the front page of the internet</title>
			</Head>
			<div className="container pt-4 mx-auto">
				{posts.map(post => (
					<div key={post.identifier} className="flex mb-4 bg-white rounded">
						<div className="w-10 text-center bg-gray-200 rounded-l">V</div>
						<div className="w-full p-2">
							<div className="flex items-center">
								<Link href={`/r/${post.subName}`}>
									<Fragment>
										<img
											src="https://i.pravatar.cc/24"
											className="w-6 h-6 mr-1 rounded cursor-pointer"
										/>
										<a className="text-xs font-bold cursor-pointer hover:underline ">
											/r/{post.subName}
										</a>
									</Fragment>
								</Link>
								<p className="text-xs text-gray-600">
									<span className="mx-1 text-gray-500">•</span>
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
							<Link href={post.url}>
								<a className="my-1 text-lg font-medium">{post.title}</a>
							</Link>
							{post.body && <p className="my-1 text-sm">{post.body}</p>}

							<div className="flex">
								<Link href={post.url}>
									<a className="">
										<div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
											<i className="mr-1 fas fa-comment-alt fa-xs"></i>
											<span className="font-bold">20 comments</span>
										</div>
									</a>
								</Link>
								<div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
									<i className="mr-1 fas fa-share fa-xs"></i>
									<span className="font-bold">Share</span>
								</div>
								<div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
									<i className="mr-1 fas fa-bookmark fa-xs"></i>
									<span className="font-bold">Save</span>
								</div>
							</div>
						</div>
					</div>
				))}
				<div className="w-160"></div>
				{/* Sidebar */}
			</div>
		</div>
	);
}

// export const getServerSideProps: GetServerSideProps = async () => {
// 	try {
// 		const res = await axios.get('/posts');

// 		const posts = res.data;

// 		return { props: { posts } };
// 	} catch (err) {
// 		return { props: { error: 'Something Went Wrong' } };
// 	}
// };
