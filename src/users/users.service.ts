import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    // Validate that SALT_ROUNDS is set
    if (!process.env.SALT_ROUNDS) {
      throw new Error('SALT_ROUNDS not found in .env');
    }
    if (parseInt(process.env.SALT_ROUNDS) < 1) {
      throw new Error('SALT_ROUNDS must be greater than 0');
    }
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await User.hashPassword(password);
    const user = Object.assign(new User(), {
      username,
      hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
