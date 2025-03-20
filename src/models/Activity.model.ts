import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Task from "./Task.model";

export interface IActivity {
    id: string;
    activity_name: string;
    task_id: string;
    task?: Task;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    unit: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    status: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';
    approvalStatus: 'Approved' | 'Not Approved' | 'Pending';
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

    @Column({
        type: DataType.ENUM('Critical', 'High', 'Medium', 'Low'),
        defaultValue: 'Medium'
    })
    priority!: 'Critical' | 'High' | 'Medium' | 'Low';

    @Column(DataType.STRING(50))
    unit!: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    progress!: number;

    @Column({
        type: DataType.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'),
        defaultValue: 'Not Started'
    })
    status!: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';

    @Column({
        type: DataType.ENUM('Approved', 'Not Approved', 'Pending'),
        defaultValue: 'Pending'
    })
    approvalStatus!: 'Approved' | 'Not Approved' | 'Pending';
}

export default Activity;