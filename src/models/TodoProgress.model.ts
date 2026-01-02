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
import Organization from "./Organization.model";

interface ITodoProgress {
    todoId: string;
    userId: string;
    progress: number;
    remark?: string;
    attachment?: string[];
    orgId?: string;
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

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default TodoProgress;
