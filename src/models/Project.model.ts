// Project.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, HasMany } from "sequelize-typescript";
import Task from "./Task.model";

@Table({ tableName: "projects" })
class Project extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    title!: string;

    @Column(DataType.ENUM('Critical', 'High', 'Medium', 'Low'))
    priority!: string;

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
    status!: string;

    @HasMany(() => Task)
    tasks!: Task[];
}

export default Project;