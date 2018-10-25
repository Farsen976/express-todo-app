import { Model, Table, Column, HasMany, BeforeCreate, Scopes } from "sequelize-typescript";
import { Todo } from "./Todo";
import * as bcrypt from 'bcrypt';

@Scopes({
  todos: {
    include: [
      {
        model  : () => Todo,
        through: {attributes: []}
      }
    ]
  }
})

@Table
export default class User extends Model<User>{
  @Column
  username: string;

  @Column
  password: string;

  @HasMany(() => Todo)
  todos?: Todo[]

  @BeforeCreate
  static hasPassword(instance: User){
    instance.password = bcrypt.hashSync(instance.password, 12)
  }
  
  static validPassword(instance: User, passwd): boolean{
    return bcrypt.compareSync(passwd, instance.password)
  } 

  validPassword(passwd: string): boolean {
    return User.validPassword(this, passwd);
  }
}