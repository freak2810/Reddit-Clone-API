import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';

export default function Home() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [agreement, setAgreement] = useState(false);
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();

	const { authenticated } = useAuthState();

	if (authenticated) router.push('/');

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		if (!agreement) {
			setErrors({ ...errors, agreement: `Please agree to T's & C's` });
			return;
		}

		try {
			await axios.post('/auth/register', {
				email,
				password,
				username,
			});

			router.push('/login');
		} catch (e) {
			console.log(e);
			setErrors(e.response.data);
		}
	};

	return (
		<div className="flex bg-white">
			<Head>
				<title>Register</title>
			</Head>
			<div
				className="h-screen bg-center bg-cover w-36"
				style={{ backgroundImage: `url('/images/bricks.jpg')` }}
			></div>
			<div className="flex flex-col justify-center pl-6">
				<div className="w-72">
					<h1 className="mb-2 text-lg font-medium">Sign Up</h1>
					<p className="mb-10 text-xs">
						By continuing, you agree to our User Agreement and Privacy Policy
					</p>
					<form onSubmit={submitForm}>
						<div className="mb-6">
							<input
								checked={agreement}
								onChange={e => setAgreement(e.target.checked)}
								type="checkbox"
								className="mr-1 cursor-pointer"
								id="agreement"
							/>
							<label
								htmlFor="agreement"
								className="text-xs cursor-pointer select-none"
							>
								I agree to get emails about cool stuff on Reddit
							</label>

							<small className="block font-medium text-red-600 ">
								{errors.agreement}
							</small>
						</div>

						<InputGroup
							className="mb-2"
							type="email"
							placeholder="Email"
							value={email}
							setValue={setEmail}
							error={errors.email}
						/>
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
							Sign Up
						</button>
					</form>
					<small>
						Already a Reditor?
						<Link href="/login">
							<a className="ml-1 text-blue-500 uppercase">Log In</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
