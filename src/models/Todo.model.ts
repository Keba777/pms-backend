import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    BelongsToMany,
    ForeignKey,
    HasMany,
    Default,
} from "sequelize-typescript";
import User from "./User.model";
import TodoMember from "./TodoMember.model";
import KPI from "./KPI.model";
import Department from "./Department.model";
import TodoProgress from "./TodoProgress.model";
import Organization from "./Organization.model";

interface ITodo {
    task: string;
    type: string;
    priority: "Urgent" | "High" | "Medium" | "Low";
    assignedById: string;
    assignedBy?: User;
    assignedUsers?: User[];
    givenDate: Date;
    dueDate: Date;
    target_date?: Date;
    target?: string[];
    kpiId?: string;
    kpi?: KPI;
    departmentId: string;
    department?: Department;
    status: "Not Started" | "In progress" | "Pending" | "Completed";
    progress: number;
    remark?: string;
    remainder?: string;
    attachment?: string[];
    orgId: string;
}

@Table({ tableName: "todos", timestamps: true })
class Todo extends Model<ITodo> implements ITodo {
    @Column({ type: DataType.STRING, allowNull: false })
    task!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    priority!: "Urgent" | "High" | "Medium" | "Low";

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    assignedById!: string;

    @BelongsTo(() => User, { foreignKey: "assignedById" })
    assignedBy?: User;

    @BelongsToMany(() => User, {
        through: () => TodoMember,
        foreignKey: "todo_id",
        otherKey: "user_id",
    })
    assignedUsers?: User[];

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    givenDate!: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    dueDate!: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    target_date?: Date;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    target?: string[];

    @ForeignKey(() => KPI)
    @Column({ type: DataType.UUID, allowNull: true })
    kpiId?: string;

    @BelongsTo(() => KPI, { foreignKey: "kpiId" })
    kpi?: KPI;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: false })
    departmentId!: string;

    @BelongsTo(() => Department, { foreignKey: "departmentId" })
    department?: Department;

    @Column({
        type: DataType.STRING,
        defaultValue: "Not Started",
        allowNull: false,
    })
    status!: "Not Started" | "In progress" | "Pending" | "Completed";

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    progress!: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    remark?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    remainder?: string;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    attachment?: string[];

    @HasMany(() => TodoProgress)
    progressUpdates?: TodoProgress[];

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID, allowNull: true })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Todo;
