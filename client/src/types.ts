export interface Post {
	identifier: string;
	title: string;
	slug: string;
	subName: string;
	createdAt: string;
	updatedAt: string;
	body?: string;
	username: string;
	sub?: Sub;

	//Virtual Fields
	url: string;
	voteScore?: number;
	commentCount?: number;
	userVote?: number;
}

export interface User {
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface Sub {
	createdAt: string;
	updatedAt: string;
	name: string;
	title: string;
	description: string;
	imageUrn?: string;
	bannerUrn?: string;
	username: string;
	imageUrl: string;
	bannerUrl?: string;
	posts: Post[];
	postCount?: number;
}

export interface Comment {
	createdAt: string;
	updatedAt: string;
	identifier: string;
	body: string;
	username: string;
	post?: Post;

	//Virtual Fields
	userVote: number;
	voteScore: number;
}
