import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Task from "./Task.model";

export interface IActivity {
    id: string;
    activity_name: string;
    task_id: string;
    task?: Task;
    unit: string;
    progress: number;
    status: string;
    resource: string;
}

@Table({ tableName: "activities" })
class Activity extends Model<IActivity> implements IActivity {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    activity_name!: string;

    @ForeignKey(() => Task)
    @Column(DataType.UUID)
    task_id!: string;

    @BelongsTo(() => Task)
    task!: Task;

    @Column(DataType.STRING(50))
    unit!: string;

    @Column(DataType.INTEGER)
    progress!: number;

    @Column(DataType.STRING(20))
    status!: string;

    @Column(DataType.STRING(100))
    resource!: string;
}

export default Activity;
