import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthorizedRequest } from '../auth/auth.guard';
import FindTaskDto from './FindTask.dto';
import { ApiSecurity } from '@nestjs/swagger';
import CreateTaskDto from './CreateTask.dto';

@ApiSecurity('bearer')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() reqBody: CreateTaskDto,
    @Req() request: AuthorizedRequest,
  ) {
    return this.tasksService.create(reqBody.title, request.userId);
  }

  @Get()
  getAllTasks(@Req() request: AuthorizedRequest) {
    return this.tasksService.findPendingTasks(request.userId);
  }

  @Get('done')
  getDoneTasks(@Req() request: AuthorizedRequest) {
    return this.tasksService.findDoneTasks(request.userId);
  }

  @Patch(':id/done')
  moveToDone(@Param() params: FindTaskDto, @Req() request: AuthorizedRequest) {
    return this.tasksService.moveToDone(params.id, request.userId);
  }

  @Patch(':id/pending')
  moveToPending(
    @Param() params: FindTaskDto,
    @Req() request: AuthorizedRequest,
  ) {
    return this.tasksService.moveToPending(params.id, request.userId);
  }
}
