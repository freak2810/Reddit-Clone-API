import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Sub } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR, { useSWRInfinite } from 'swr';
import React, { Fragment, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export default function Home() {
	const [observedPost, setObservedPost] = useState('');

	// const { data: posts } = useSWR<Post[]>('/posts');
	const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

	const {
		data,
		error,
		size: page,
		setSize: setPage,
		isValidating,
		revalidate,
	} = useSWRInfinite<Post[]>(index => `/posts?page=${index}`);

	const initialLoading = !data && !error;
	const posts: Post[] = data ? [].concat(...data) : [];

	useEffect(() => {
		if (!posts || posts.length === 0) return;

		const id = posts[posts.length - 1].identifier;

		if (id !== observedPost) {
			setObservedPost(id);
			observeElement(document.getElementById(id));
		}
	}, [posts]);

	const observeElement = (element: HTMLElement) => {
		if (!element) return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting === true) {
					// console.log('reached bottom of posts');
					setPage(page + 1);
					observer.unobserve(element);
				}
			},
			{ threshold: 1 }
		);

		observer.observe(element);
	};

	return (
		<Fragment>
			<Head>
				<title>readit: the front page of the internet</title>
				<meta
					property="og:title"
					content="readit: the front page of the internet"
				/>
				<meta
					property="twitter:title"
					content="readit: the front page of the internet"
				/>
				<meta
					property="og:description"
					content="Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!"
				/>
				<meta
					property="twitter:description"
					content="Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!"
				/>
				<meta
					name="description"
					content="Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!"
				/>
			</Head>
			<div className="container flex pt-4">
				{/* Posts feed */}
				<div className="w-full">
					{initialLoading && <p className="text-lg text-center">Loading ..</p>}
					{posts?.map(post => (
						<PostCard
							post={post}
							key={post.identifier}
							revalidate={revalidate}
						/>
					))}
					{isValidating && posts.length > 0 && (
						<p className="text-lg text-center">Loading more..</p>
					)}
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
