import {
    Table, Column, Model, DataType, PrimaryKey, HasMany, BelongsToMany, Default
} from "sequelize-typescript";
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
    progress?: number;
    isFavourite?: boolean;
    status: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';
    members?: string[];  // Optional array of member IDs
    tagIds?: string[];  // Optional array of tag IDs
    tasks?: Task[];
}

@Table({ tableName: "projects" })
class Project extends Model<IProject> implements IProject {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
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

    @Default(0)
    @Column(DataType.INTEGER)
    progress!: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isFavourite!: boolean;

    @Column(DataType.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'))
    status!: 'Not Started' | 'Started' | 'InProgress' | 'Canceled' | 'Onhold' | 'Completed';

    @Column({
        type: DataType.ARRAY(DataType.UUID),
        allowNull: true
    })
    members?: string[];

    @Column({
        type: DataType.ARRAY(DataType.UUID),
        allowNull: true
    })
    tagIds?: string[];

    @HasMany(() => Task)
    tasks!: Task[];
}

export default Project;
