import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Project from "./Project.model";
import Activity from "./Activity.model";

export interface ITask {
    id: string;
    task_name: string;
    project_id: string;
    project?: Project;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    start_date: Date;
    end_date: Date;
    progress: number;
    activities?: Activity[];
}

@Table({ tableName: "tasks" })
class Task extends Model<ITask> implements ITask {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    task_name!: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    project_id!: string;

    @BelongsTo(() => Project)
    project!: Project;

    @Column(DataType.ENUM('Critical', 'High', 'Medium', 'Low'))
    priority!: 'Critical' | 'High' | 'Medium' | 'Low';

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Column(DataType.INTEGER)
    progress!: number;

    @HasMany(() => Activity)
    activities!: Activity[];
}

export default Task;
