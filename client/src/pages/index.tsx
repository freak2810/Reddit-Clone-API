import Head from 'next/head';
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import useSWR from 'swr';

dayjs.extend(relativeTime);

export default function Home() {
	const { data } = useSWR('/posts');

	const posts = data as Post[];

	return (
		<div>
			<Head>
				<title>Reddit: the front page of the internet</title>
			</Head>
			<div className="container pt-4 mx-auto">
				{posts?.map(post => (
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
