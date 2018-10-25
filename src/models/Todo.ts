import {Table, Column, Model, BelongsTo, UpdatedAt, CreatedAt, ICreateOptions, ForeignKey} from 'sequelize-typescript';
import User from './User';
import { FilteredModelAttributes } from 'sequelize-typescript/lib/models/Model';

export enum Completion{
  IN_PROGESS = 'in progress',
  TODO       = 'todo',
  DONE       = 'done'
}

@Table
export class Todo extends Model<Todo>{
  @Column
  message: string;

  @Column
  completion: Completion;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

}