import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  done: boolean;

  @Exclude()
  @ManyToOne(() => User, (user) => user.tasks)
  user?: User;

  // TypeORM omits the exclude decorator  when saving the entity
  removeRelation() {
    delete this.user;
    return this;
  }
}
