import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { Sub } from '../types';

const Navbar: React.FC = () => {
	const [name, setName] = useState('');
	const [subs, setSubs] = useState<Sub[]>([]);
	const [timer, setTimer] = useState(null);

	const { authenticated, loading } = useAuthState();
	const dispatch = useAuthDispatch();
	const router = useRouter();

	useEffect(() => {
		if (name.trim().length < 1) {
			setSubs([]);
			return;
		}

		searchSubs();
	}, [name]);

	const logout = () => {
		axios
			.get('/auth/logout')
			.then(() => {
				dispatch('LOGOUT');
				window.location.reload();
			})
			.catch(err => console.log(err));
	};

	const searchSubs = async () => {
		clearTimeout(timer);
		setTimer(
			setTimeout(async () => {
				try {
					const { data } = await axios.get(`/subs/search/${name}`);
					setSubs(data);
				} catch (err) {
					console.log(err);
				}
			}, 250)
		);
	};

	const goToSub = (subName: string) => {
		router.push(`/r/${subName}`);
		setName('');
	};

	return (
		<div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
			<div className="flex items-center">
				<Link href="/">
					<a>
						<Image
							height={32}
							width={32}
							className="align-middle"
							src="/images/reddit-logo.svg"
						/>
					</a>
				</Link>
				<span className="ml-2 text-2xl font-semibold">
					<Link href="/">Reddit</Link>
				</span>
			</div>
			<div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
				<i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
				<input
					placeholder="Search"
					type="text"
					className="py-1 pr-3 bg-transparent rounded w-[40rem] focus:outline-none"
					value={name}
					onChange={e => setName(e.target.value)}
				/>
				<div
					className="absolute left-0 right-0 bg-white"
					style={{ top: '100%' }}
				>
					{subs?.map(sub => (
						<div
							className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
							onClick={() => goToSub(sub.name)}
						>
							<Image
								src={sub.imageUrl}
								alt={sub.name}
								height={32}
								width={32}
								className="rounded-full"
							/>
							<div className="ml-4 text-sm">
								<p className="font-medium">{sub.name}</p>
								<p className="text-gray-600">{sub.title}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			{!loading && (
				<div className="flex">
					{authenticated ? (
						<button
							className="w-32 py-1 mr-4 leading-5 button blue hollow"
							onClick={logout}
						>
							Logout
						</button>
					) : (
						<Fragment>
							<Link href="/login">
								<a className="w-32 py-1 mr-4 leading-5 button blue hollow">
									Login
								</a>
							</Link>
							<Link href="/register">
								<a className="w-32 py-1 leading-5 button blue">Sign Up</a>
							</Link>
						</Fragment>
					)}
				</div>
			)}
		</div>
	);
};

export default Navbar;
