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
    BeforeUpdate,
} from "sequelize-typescript";
import { randomUUID } from "crypto";
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

// Progress update item stored in JSONB per change
export interface ProgressUpdateItem {
    id?: string; // generated UUID if missing
    dateTime: string; // ISO string
    fromProgress?: number; // previous progress (optional)
    progress?: number; // new progress value
    remark?: string;
    status?: string;
    checkedBy?: string;
    approvedBy?: string;
    action?: string;
    summaryReport?: string;
    comment?: string;
    approvedDate?: string | null; // ISO string or null
    userId?: string; // who applied the change (optional)
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
    progressUpdates?: ProgressUpdateItem[] | null;
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

    // NEW: progressUpdates JSONB column
    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    progressUpdates?: ProgressUpdateItem[] | null;

    // BeforeUpdate hook: append progress update entry if progress changed,
    // or if options.progressUpdate is provided append that object.
    @BeforeUpdate
    static async handleProgressUpdates(instance: Task, options: any) {
        try {
            const userIdFromOptions: string | undefined = options?.userId;

            // get previous progressUpdates via public previous() API when available, else fallback to getDataValue
            const prevProgressUpdatesRaw = (instance as any).previous
                ? (instance as any).previous("progressUpdates")
                : undefined;
            const prevProgressUpdates = Array.isArray(prevProgressUpdatesRaw)
                ? prevProgressUpdatesRaw
                : instance.getDataValue("progressUpdates") ?? [];

            const workingUpdates: ProgressUpdateItem[] = Array.isArray(prevProgressUpdates)
                ? [...prevProgressUpdates]
                : [];

            // If caller supplied a full progressUpdate in options, prefer that (recommended)
            if (options && options.progressUpdate) {
                const provided: Partial<ProgressUpdateItem> = options.progressUpdate;
                const item: ProgressUpdateItem = {
                    id: provided.id || randomUUID(),
                    dateTime: provided.dateTime || new Date().toISOString(),
                    fromProgress: provided.fromProgress,
                    progress: typeof provided.progress === "number" ? provided.progress : instance.getDataValue("progress"),
                    remark: provided.remark,
                    status: provided.status,
                    checkedBy: provided.checkedBy,
                    approvedBy: provided.approvedBy,
                    action: provided.action,
                    summaryReport: provided.summaryReport,
                    comment: provided.comment,
                    approvedDate: provided.approvedDate ?? null,
                    userId: provided.userId || userIdFromOptions,
                };
                workingUpdates.push(item);

                // ensure main progress reflects provided progress if present
                if (typeof provided.progress === "number") {
                    instance.setDataValue("progress", provided.progress);
                }
                instance.setDataValue("progressUpdates", workingUpdates);
                return;
            }

            // Otherwise, automatic behavior when progress changed:
            const progressPreviously = (instance as any).previous
                ? (instance as any).previous("progress")
                : undefined;
            const prevProgress = typeof progressPreviously === "number" ? progressPreviously : undefined;

            // Use Sequelize's changed() method to detect change
            const changedFn = (instance as any).changed;
            const progressChanged = typeof changedFn === "function" ? !!(instance as any).changed("progress") : prevProgress !== undefined && prevProgress !== instance.getDataValue("progress");

            if (progressChanged) {
                const prev = typeof prevProgress === "number" ? prevProgress : 0;
                const newProgress = instance.getDataValue("progress");
                const item: ProgressUpdateItem = {
                    id: randomUUID(),
                    dateTime: new Date().toISOString(),
                    fromProgress: prev,
                    progress: typeof newProgress === "number" ? newProgress : 0,
                    status: instance.getDataValue("status") ?? undefined,
                    userId: userIdFromOptions,
                };
                workingUpdates.push(item);
                instance.setDataValue("progressUpdates", workingUpdates);
            }
        } catch (err) {
            // don't block update on hook errors; log for troubleshooting
            // eslint-disable-next-line no-console
            console.warn("Error in Task.handleProgressUpdates hook:", err);
        }
    }

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
