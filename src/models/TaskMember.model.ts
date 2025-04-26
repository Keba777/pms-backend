import { Table, Model, Column, ForeignKey, DataType } from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";

@Table({
    tableName: "task_members",
    timestamps: false, // Disable automatic timestamps
})
export class TaskMember extends Model {
    @ForeignKey(() => Task)
    @Column({ field: "task_id", type: DataType.UUID })
    taskId!: string;

    @ForeignKey(() => User)
    @Column({ field: "user_id", type: DataType.UUID })
    userId!: string;
}
export default TaskMember;