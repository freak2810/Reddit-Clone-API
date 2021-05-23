import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import trim from './middleware/trim';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);

app.use(cookieParser());

app.get('/', (_, res) => {
	res.send('Hello World');
});

app.use('/api/auth', authRoutes);

app.listen(8000, async () => {
	console.log('server running at http://localhost:8000');

	try {
		await createConnection();
		console.log('database connected');
	} catch (e) {
		console.log(e);
	}
});
