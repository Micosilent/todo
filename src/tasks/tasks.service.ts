import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Task } from './tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private usersService: UsersService,
  ) {}

  private async findUser(id: number): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new UnauthorizedException();

    return user;
  }
  async create(title: string, userId: number): Promise<Task> {
    const user = await this.findUser(userId);

    const task = Object.assign(new Task(), {
      title,
      user,
    });

    return (await this.tasksRepository.save(task)).removeRelation();
  }

  async findDoneTasks(userId: number): Promise<Task[]> {
    const user = await this.findUser(userId);

    return this.tasksRepository.find({ where: { done: true, user } });
  }

  async findPendingTasks(userId: number): Promise<Task[]> {
    const user = await this.findUser(userId);

    return this.tasksRepository.find({ where: { done: false, user } });
  }

  async moveToPending(id: number, userId: number): Promise<Task> {
    const user = await this.findUser(userId);
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException();
    if (!task.done) return task;

    task.done = false;
    return this.tasksRepository.save(task);
  }

  async moveToDone(id: number, userId: number): Promise<Task> {
    const user = await this.findUser(userId);
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException();
    if (task.done) return task;

    task.done = true;
    return this.tasksRepository.save(task);
  }
}
