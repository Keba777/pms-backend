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
    BeforeUpdate,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { randomUUID } from "crypto";
import Task from "./Task.model";
import User from "./User.model";
import ProjectMember from "./ProjectMember.model";
import WorkflowLog from "./WorkflowLog.model";
import Site from "./Site.model";
import Client from "./Client.model";
import Organization from "./Organization.model";

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
    client_id?: string;
    clientInfo?: Client;
    site_id?: string;
    projectSite?: Site;
    progress?: number;
    isFavourite?: boolean;
    status: ProjectStatus;
    members?: User[];
    tagIds?: string[];
    tasks?: Task[];
    actuals?: ProjectActuals | null;
    attachments?: string[];
    orgId: string;

    // progress updates
    progressUpdates?: ProgressUpdateItem[] | null;
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

    @Column(DataType.STRING)
    priority!: "Critical" | "High" | "Medium" | "Low";

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Column(DataType.DECIMAL(20, 2))
    budget!: number;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    site_id?: string;

    @ForeignKey(() => Client)
    @Column({ type: DataType.UUID, allowNull: true })
    client_id?: string;

    @BelongsTo(() => Client)
    clientInfo?: Client;

    @BelongsTo(() => Site)
    projectSite?: Site;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID, allowNull: true })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;

    @Default(0)
    @Column(DataType.INTEGER)
    progress!: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isFavourite!: boolean;

    @Column(DataType.STRING)
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

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
        defaultValue: []
    })
    attachments?: string[];

    @HasMany(() => Task)
    tasks!: Task[];

    @Default({})
    @Column(DataType.JSONB)
    actuals?: ProjectActuals | null;

    // NEW: progressUpdates JSONB column
    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    progressUpdates?: ProgressUpdateItem[] | null;

    // BeforeUpdate hook: append progress update entry if progress changed,
    // or if options.progressUpdate is provided append that object.
    @BeforeUpdate
    static async handleProgressUpdates(instance: Project, options: any) {
        try {
            const userIdFromOptions: string | undefined = options?.userId;

            // Get previous progressUpdates via public previous() API when available, else fallback to getDataValue
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
            console.warn("Error in Project.handleProgressUpdates hook:", err);
        }
    }

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