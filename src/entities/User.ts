import {
	Entity as TOEntity,
	Column,
	Index,
	BeforeInsert,
	OneToMany,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import Entity from './Entity';
import Post from './Post';

@TOEntity('users')
export default class User extends Entity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@Index()
	@Column({ unique: true })
	@IsEmail()
	email: string;

	@Column({ unique: true })
	@Length(3, 255, {
		message: 'Username must be at least 3 characters long',
	})
	username: string;

	@Column()
	@Length(6)
	@Exclude()
	password: string;

	@OneToMany(() => Post, post => post.user)
	posts: Post[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 6);
	}
}
