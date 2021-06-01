import Image from 'next/image';
import Link from 'next/link';

const Navbar: React.FC = () => {
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
			<div className="flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
				<i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
				<input
					placeholder="Search"
					type="text"
					className="py-1 pr-3 bg-transparent rounded w-[40rem] focus:outline-none"
				/>
			</div>
			<div className="flex">
				<Link href="/login">
					<a className="w-32 py-1 mr-4 leading-5 button blue hollow">Login</a>
				</Link>
				<Link href="/register">
					<a className="w-32 py-1 leading-5 button blue">Sign Up</a>
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
