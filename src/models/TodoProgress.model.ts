import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Todo from "./Todo.model";
import User from "./User.model";

interface ITodoProgress {
    todoId: string;
    userId: string;
    progress: number;
    remark?: string;
    attachment?: string[];
}

@Table({ tableName: "todo_progress", timestamps: true })
class TodoProgress extends Model<ITodoProgress> implements ITodoProgress {
    @ForeignKey(() => Todo)
    @Column({ type: DataType.UUID, allowNull: false })
    todoId!: string;

    @BelongsTo(() => Todo)
    todo?: Todo;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @Column({ type: DataType.INTEGER, allowNull: false })
    progress!: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    remark?: string;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    attachment?: string[];
}

export default TodoProgress;
