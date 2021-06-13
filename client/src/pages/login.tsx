import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../context/auth';

export default function Home() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();
	const dispatch = useAuthDispatch();
	const { authenticated } = useAuthState();

	if (authenticated) router.push('/');

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		try {
			const res = await axios.post('/auth/login', {
				password,
				username,
			});

			dispatch('LOGIN', res.data);

			router.back();
		} catch (e) {
			console.log(e);
			setErrors(e.response.data);
		}
	};

	return (
		<div className="flex bg-white">
			<Head>
				<title>Login</title>
			</Head>
			<div
				className="h-screen bg-center bg-cover w-36"
				style={{ backgroundImage: `url('/images/bricks.jpg')` }}
			></div>
			<div className="flex flex-col justify-center pl-6">
				<div className="w-72">
					<h1 className="mb-2 text-lg font-medium">Login</h1>
					<form onSubmit={submitForm}>
						<InputGroup
							className="mb-2"
							type="text"
							placeholder="Username"
							value={username}
							setValue={setUsername}
							error={errors.username}
						/>
						<InputGroup
							className="mb-4"
							type="password"
							placeholder="Password"
							value={password}
							setValue={setPassword}
							error={errors.password}
						/>

						<button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-400 rounded">
							Login
						</button>
					</form>
					<small>
						New To Reddit?
						<Link href="/register">
							<a className="ml-1 text-blue-500 uppercase">Register</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
