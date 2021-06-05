import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';

dayjs.extend(relativeTime);

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		axios
			.get('/posts')
			.then(res => {
				setPosts(res.data);
				console.log(res.data);
			})
			.catch(err => console.log(err));
	}, []);

	return (
		<div className="pt-12">
			<Head>
				<title>Reddit: the front page of the internet</title>
			</Head>
			<div className="container pt-4 mx-auto">
				{posts.map(post => (
					<PostCard post={post} key={post.identifier} />
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
