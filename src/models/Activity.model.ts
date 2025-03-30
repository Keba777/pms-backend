import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Task from "./Task.model";
import Material from "./Material.model";
import Equipment from "./Equipment.model";
import Labor from "./Labor.model";

export interface IActivity {
    id: string;
    activity_name: string;
    description?: string;
    task_id: string;
    task?: Task;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    quantity?: number;
    unit: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    status: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';
    approvalStatus: 'Approved' | 'Not Approved' | 'Pending';
    materials?: Material[];
    equipment?: Equipment[];
    labors?: Labor[];
}

@Table({ tableName: "activities", timestamps: true })
class Activity extends Model<IActivity> implements IActivity {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    activity_name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @ForeignKey(() => Task)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    task_id!: string;

    @BelongsTo(() => Task)
    task!: Task;

    @Column({
        type: DataType.ENUM('Critical', 'High', 'Medium', 'Low'),
        defaultValue: 'Medium',
        allowNull: false,
    })
    priority!: 'Critical' | 'High' | 'Medium' | 'Low';

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: true,
    })
    quantity?: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    unit!: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    start_date!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    end_date!: Date;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    progress!: number;

    @Column({
        type: DataType.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'),
        defaultValue: 'Not Started',
        allowNull: false,
    })
    status!: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';

    @Column({
        type: DataType.ENUM('Approved', 'Not Approved', 'Pending'),
        defaultValue: 'Pending',
        allowNull: false,
    })
    approvalStatus!: 'Approved' | 'Not Approved' | 'Pending';

    // Define associations to child models
    @HasMany(() => Material)
    materials?: Material[];

    @HasMany(() => Equipment)
    equipment?: Equipment[];

    @HasMany(() => Labor)
    labors?: Labor[];
}

export default Activity;
