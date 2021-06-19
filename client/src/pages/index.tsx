import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Sub } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR from 'swr';
import React, { Fragment } from 'react';

dayjs.extend(relativeTime);

export default function Home() {
	const { data: posts } = useSWR<Post[]>('/posts');
	const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

	return (
		<Fragment>
			<Head>
				<title>readit: the front page of the internet</title>
			</Head>
			<div className="container flex pt-4">
				{/* Posts feed */}
				<div className="w-full">
					{posts?.map(post => (
						<PostCard post={post} key={post.identifier} />
					))}
				</div>
				{/* Sidebar */}
				<div className="ml-6 w-80">
					<div className="bg-white rounded">
						<div className="p-4 border-b-2">
							<p className="text-lg font-semibold text-center">
								Top Communities
							</p>
						</div>
						<div>
							{topSubs?.map((sub: Sub) => (
								<div
									key={sub.name}
									className="flex items-center px-4 py-2 text-xs border-b"
								>
									<Link href={`/r/${sub.name}`}>
										<Image
											className="rounded-full "
											src={sub.imageUrl}
											alt="Sub"
											width={(6 * 16) / 4}
											height={(6 * 16) / 4}
										/>
									</Link>

									<Link href={`/r/${sub.name}`}>
										<a className="ml-2 font-bold hover:cursor-pointer">
											/r/{sub.name}
										</a>
									</Link>
									<p className="ml-auto font-med">{sub.postCount}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
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
