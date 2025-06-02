import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Department from "./Department.model";
import Site from "./Site.model";
import Activity from "./Activity.model";
import Project from "./Project.model";
import Task from "./Task.model";
import User from "./User.model";

export interface IIssue {
    id: string;
    date: Date;
    issueType: string;
    description: string;
    raisedById: string;
    priority?: "Urgent" | "Medium" | "Low";
    siteId?: string;
    departmentId?: string;
    responsibleId?: string;
    actionTaken?: string;
    status: "Open" | "In Progress" | "Resolved" | "Closed";

    // Only one of these at a time:
    activityId?: string;
    projectId?: string;
    taskId?: string;
}

@Table({
    tableName: "issues",
    timestamps: true,
    validate: {
        onlyOneAssociation() {
            const count =
                (this.activityId ? 1 : 0) +
                (this.projectId ? 1 : 0) +
                (this.taskId ? 1 : 0);
            if (count > 1) {
                throw new Error(
                    "Only one of activityId, projectId, or taskId can be set on an Issue."
                );
            }
        },
    },
})
class Issue extends Model<IIssue> implements IIssue {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    date!: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    issueType!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    description!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    raisedById!: string;
    @BelongsTo(() => User, "raisedById")
    raisedBy!: User;

    @Column({
        type: DataType.ENUM("Urgent", "Medium", "Low"),
        allowNull: true,
        defaultValue: "Medium",
    })
    priority?: IIssue["priority"];

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: true })
    siteId?: string;
    @BelongsTo(() => Site)
    site?: Site;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    departmentId?: string;
    @BelongsTo(() => Department)
    department?: Department;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    responsibleId?: string;
    @BelongsTo(() => User, "responsibleId")
    responsible?: User;

    @Column({ type: DataType.TEXT, allowNull: true })
    actionTaken?: string;

    @Column({
        type: DataType.ENUM("Open", "In Progress", "Resolved", "Closed"),
        allowNull: false,
        defaultValue: "Open",
    })
    status!: IIssue["status"];

    // Optional associations: only one may be non-null
    @ForeignKey(() => Activity)
    @Column({ type: DataType.UUID, allowNull: true })
    activityId?: string;
    @BelongsTo(() => Activity)
    activity?: Activity;

    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: true })
    projectId?: string;
    @BelongsTo(() => Project)
    project?: Project;

    @ForeignKey(() => Task)
    @Column({ type: DataType.UUID, allowNull: true })
    taskId?: string;
    @BelongsTo(() => Task)
    task?: Task;
}

export default Issue;
