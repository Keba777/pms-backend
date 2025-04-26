import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany,
    BelongsToMany,
} from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";
import ProjectMember from "./ProjectMember.model";

export interface IProject {
    id: string;
    title: string;
    description?: string;
    priority: "Critical" | "High" | "Medium" | "Low";
    start_date: Date;
    end_date: Date;
    budget: number;
    client: string;
    site: string;
    progress?: number;
    isFavourite?: boolean;
    status: "Not Started" | "Started" | "InProgress" | "Canceled" | "Onhold" | "Completed";
    members?: User[];
    tagIds?: string[];
    tasks?: Task[];
}

@Table({ tableName: "projects", timestamps: true })
class Project extends Model<IProject> implements IProject {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column(DataType.STRING(100))
    title!: string;

    @Column(DataType.TEXT)
    description?: string;

    @Column(DataType.ENUM("Critical", "High", "Medium", "Low"))
    priority!: "Critical" | "High" | "Medium" | "Low";

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

    @Column(
        DataType.ENUM(
            "Not Started",
            "Started",
            "InProgress",
            "Canceled",
            "Onhold",
            "Completed"
        )
    )
    status!: IProject["status"];

    @BelongsToMany(() => User, {
        through: () => ProjectMember, 
        foreignKey: "project_id",
        otherKey: "user_id"
      })
      members?: User[];

    @Column({
        type: DataType.ARRAY(DataType.UUID),
        allowNull: true,
    })
    tagIds?: string[];

    @HasMany(() => Task)
    tasks!: Task[];
}

export default Project;
