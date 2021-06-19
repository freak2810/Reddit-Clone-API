import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc';
import userRoutes from './routes/users';
import trim from './middleware/trim';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);

app.use(cookieParser());

app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN,
		optionsSuccessStatus: 200,
	})
);

app.use(express.static('public'));

app.get('/', (_, res) => {
	res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/users', userRoutes);
app.use('/api/misc', miscRoutes);

app.listen(PORT, async () => {
	console.log(`server running at http://localhost:${PORT}`);

	try {
		await createConnection();
		console.log('database connected');
	} catch (e) {
		console.log(e);
	}
});
