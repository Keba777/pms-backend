import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
    HasMany,
    Default,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
} from "sequelize-typescript";
import Project from "./Project.model";
import Activity from "./Activity.model";
import User from "./User.model";
import TaskMember from "./TaskMember.model";
import WorkflowLog from "./WorkflowLog.model";

type TaskStatus =
    | "Not Started"
    | "Started"
    | "InProgress"
    | "Canceled"
    | "Onhold"
    | "Completed";

export interface TaskActuals {
    start_date?: string | Date | null;
    end_date?: string | Date | null;
    progress?: number | null;
    status?: TaskStatus | null;
    budget?: number | string | null;
}

export interface ITask {
    id: string;
    task_name: string;
    description?: string;
    project_id: string;
    project?: Project;
    priority: "Critical" | "High" | "Medium" | "Low";
    start_date: Date;
    end_date: Date;
    progress?: number;
    status: TaskStatus;
    approvalStatus: "Approved" | "Not Approved" | "Pending";
    assignedUsers?: User[];
    activities?: Activity[];

    // New fields
    budget?: number | string; // top-level budget (DECIMAL)
    actuals?: TaskActuals | null; // small task-specific actuals object
}

@Table({ tableName: "tasks", timestamps: true })
class Task extends Model<ITask> implements ITask {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column(DataType.STRING(100))
    task_name!: string;

    @Column(DataType.TEXT)
    description?: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    project_id!: string;

    @BelongsTo(() => Project)
    project!: Project;

    @Column(DataType.ENUM("Critical", "High", "Medium", "Low"))
    priority!: "Critical" | "High" | "Medium" | "Low";

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Default(0)
    @Column(DataType.INTEGER)
    progress!: number;

    @Column({
        type: DataType.ENUM(
            "Not Started",
            "Started",
            "InProgress",
            "Canceled",
            "Onhold",
            "Completed"
        ),
        defaultValue: "Not Started",
    })
    status!: TaskStatus;

    @Column({
        type: DataType.ENUM("Approved", "Not Approved", "Pending"),
        defaultValue: "Not Approved",
    })
    approvalStatus!: "Approved" | "Not Approved" | "Pending";

    @BelongsToMany(() => User, {
        through: () => TaskMember,
        foreignKey: "task_id",
        otherKey: "user_id",
    })
    assignedUsers!: User[];

    @HasMany(() => Activity)
    activities!: Activity[];

    /**
     * Top-level budget on task (requested).
     * Stored as DECIMAL(12,2) with default 0.00.
     * Note: some DB adapters return DECIMAL as string — coerce in your service layer if needed.
     */
    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    budget?: number | string;

    /**
     * Task-specific actuals (small object, NOT the Activity actuals).
     * Only contains: start_date, end_date, progress, status, budget.
     * Stored as JSONB (Postgres). Default is empty object.
     */
    @Default({})
    @Column(DataType.JSONB)
    actuals?: TaskActuals | null;

    // Hook for creating a task
    @AfterCreate
    static async logCreate(instance: Task, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Created",
            "Task",
            `Task "${instance.task_name}" created`
        );
    }

    // Hook for updating a task
    @AfterUpdate
    static async logUpdate(instance: Task, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Updated",
            "Task",
            `Task "${instance.task_name}" updated`
        );
    }

    // Hook for deleting a task
    @AfterDestroy
    static async logDestroy(instance: Task, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Deleted",
            "Task",
            `Task "${instance.task_name}" deleted`
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
        console.warn(
            `No userId provided for WorkflowLog creation in ${entityType} ${action}`
        );
        return;
    }

    await WorkflowLog.create(
        {
            entityType,
            entityId: instance.getDataValue("id"),
            action,
            status: instance.getDataValue("status") || undefined,
            userId,
            details,
        },
        { transaction: options.transaction }
    );
}

export default Task;
