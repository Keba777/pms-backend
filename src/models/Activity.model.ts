// Activity.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Task from "./Task.model";

@Table({ tableName: "activities" })
class Activity extends Model {
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