import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import Task from "./Task.model";

export interface IProject {
    id: string;
    title: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    start_date: Date;
    end_date: Date;
    budget: number;
    client: string;
    site: string;
    progress: number;
    status: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';
    tasks?: Task[];
}

@Table({ tableName: "projects" })
class Project extends Model<IProject> implements IProject {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    title!: string;

    @Column(DataType.ENUM('Critical', 'High', 'Medium', 'Low'))
    priority!: 'Critical' | 'High' | 'Medium' | 'Low';

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Column(DataType.DECIMAL(12, 2))
    budget!: number;

    @Column(DataType.STRING(100))
    client!: string;

    @Column(DataType.STRING(100))
    site!: string;

    @Column(DataType.INTEGER)
    progress!: number;

    @Column(DataType.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'))
    status!: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';

    @HasMany(() => Task)
    tasks!: Task[];
}

export default Project;