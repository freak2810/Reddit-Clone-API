import '../styles/globals.css';
import '../styles/icons.css';
import { AppProps } from 'next/app';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/auth';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter();
	const authRoutes = ['/register', '/login'];
	const authRoute = authRoutes.includes(pathname);

	return (
		<AuthProvider>
			{!authRoute && <Navbar />}
			<Component {...pageProps} />{' '}
		</AuthProvider>
	);
}

export default MyApp;
