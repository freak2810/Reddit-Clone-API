import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 6);
	}

	toJSON() {
		return classToPlain(this);
	}
}
