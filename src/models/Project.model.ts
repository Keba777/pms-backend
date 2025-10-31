import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany,
    BelongsToMany,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
} from "sequelize-typescript";
import Task from "./Task.model";
import User from "./User.model";
import ProjectMember from "./ProjectMember.model";
import WorkflowLog from "./WorkflowLog.model";

type ProjectStatus =
    | "Not Started"
    | "Started"
    | "InProgress"
    | "Canceled"
    | "Onhold"
    | "Completed";

export interface ProjectActuals {
    start_date?: string | Date | null;
    end_date?: string | Date | null;
    progress?: number | null;
    status?: ProjectStatus | null;
    budget?: number | string | null;
}

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
    site_id?: string;
    progress?: number;
    isFavourite?: boolean;
    status: ProjectStatus;
    members?: User[];
    tagIds?: string[];
    tasks?: Task[];
    actuals?: ProjectActuals | null;
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

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    site_id?: string;

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

    @Default({})
    @Column(DataType.JSONB)
    actuals?: ProjectActuals | null;

    // Hook for creating a project
    @AfterCreate
    static async logCreate(instance: Project, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Created",
            "Project",
            `Project "${instance.title}" created`
        );
    }

    // Hook for updating a project
    @AfterUpdate
    static async logUpdate(instance: Project, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Updated",
            "Project",
            `Project "${instance.title}" updated`
        );
    }

    // Hook for deleting a project
    @AfterDestroy
    static async logDestroy(instance: Project, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Deleted",
            "Project",
            `Project "${instance.title}" deleted`
        );
    }
}

// Reusable utility function for workflow logging
async function createWorkflowLogHook(
    instance: Model<any>,
    options: any,
    action: "Created" | "Updated" | "Deleted",
    entityType: "Project" | "Task" | "Activity" | "Approval",
    details: string
) {
    const userId = options.userId;
    if (!userId) {
        console.warn(`No userId provided for WorkflowLog creation in ${entityType} ${action}`);
        return;
    }

    await WorkflowLog.create({
        entityType,
        entityId: instance.getDataValue("id"),
        action,
        status: instance.getDataValue("status") || undefined,
        userId,
        details,
    }, { transaction: options.transaction });
}

export default Project;