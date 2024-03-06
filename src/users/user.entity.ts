import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/tasks.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hashedPassword: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
  static async hashPassword(password: string) {
    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.hashedPassword);
  }
}
