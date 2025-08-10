import { Table, Model, Column, ForeignKey, DataType } from "sequelize-typescript";
import Todo from "./Todo.model";
import User from "./User.model";

@Table({
    tableName: "todo_members",
    timestamps: true,
})
export class TodoMember extends Model {
    @ForeignKey(() => Todo)
    @Column({ field: "todo_id", type: DataType.UUID })
    todoId!: string;

    @ForeignKey(() => User)
    @Column({ field: "user_id", type: DataType.UUID })
    userId!: string;
}
export default TodoMember;