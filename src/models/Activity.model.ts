import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    HasMany,
    BelongsToMany,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
    BeforeUpdate,
} from "sequelize-typescript";
import { randomUUID } from "crypto";
import Task from "./Task.model";
import Request from "./Request.model";
import User from "./User.model";
import ActivityMember from "./ActivityMember.model";
import WorkflowLog from "./WorkflowLog.model";

// Define interfaces for list items
export interface WorkForceItem {
    man_power: string;
    qty: number;
    rate: number;
    est_hrs: number;
}

export interface MachineryItem {
    equipment: string;
    qty: number;
    rate: number;
    est_hrs: number;
}

export interface MaterialItem {
    material: string;
    qty: number;
    rate: number;
}

export interface Actuals {
    quantity: number | null;
    unit: string | null;
    start_date: Date | null;
    end_date: Date | null;
    progress: number | null;
    status: "Not Started" | "Started" | "InProgress" | "Canceled" | "Onhold" | "Completed" | null;
    labor_cost: number | null;
    material_cost: number | null;
    equipment_cost: number | null;
    total_cost: number | null;
    work_force: WorkForceItem[] | null;
    machinery_list: MachineryItem[] | null;
    materials_list: MaterialItem[] | null;
}

// Progress update item stored in JSONB per change
export interface ProgressUpdateItem {
    id?: string; // generated UUID if missing
    dateTime: string; // ISO string
    fromProgress?: number; // previous progress (optional)
    progress: number; // new progress value
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

export interface IActivity {
    id: string;
    activity_name: string;
    description?: string;
    task_id: string;
    task?: Task;
    priority: "Critical" | "High" | "Medium" | "Low";
    quantity?: number;
    unit: string;
    start_date: Date;
    end_date: Date;
    progress: number;
    status: "Not Started" | "Started" | "InProgress" | "Canceled" | "Onhold" | "Completed";
    approvalStatus: "Approved" | "Not Approved" | "Pending";
    assignedUsers?: User[];
    requests?: Request[];
    image?: string;
    labor_index_factor?: number;
    labor_utilization_factor?: number;
    labor_working_hours_per_day?: number;
    machinery_index_factor?: number;
    machinery_utilization_factor?: number;
    machinery_working_hours_per_day?: number;
    labor_cost?: number;
    material_cost?: number;
    equipment_cost?: number;
    total_cost?: number;
    work_force?: WorkForceItem[];
    machinery_list?: MachineryItem[];
    materials_list?: MaterialItem[];
    checked_by_name?: string;
    checked_by_date?: Date;
    actuals?: Actuals | null;
    progressUpdates?: ProgressUpdateItem[] | null;
}

@Table({ tableName: "activities", timestamps: true })
class Activity extends Model<IActivity> implements IActivity {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    activity_name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @ForeignKey(() => Task)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    task_id!: string;

    @BelongsTo(() => Task)
    task!: Task;

    @Column({
        type: DataType.ENUM("Critical", "High", "Medium", "Low"),
        defaultValue: "Medium",
        allowNull: false,
    })
    priority!: "Critical" | "High" | "Medium" | "Low";

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: true,
    })
    quantity?: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    unit!: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    start_date!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    end_date!: Date;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    progress!: number;

    @Column({
        type: DataType.ENUM("Not Started", "Started", "InProgress", "Canceled", "Onhold", "Completed"),
        defaultValue: "Not Started",
        allowNull: false,
    })
    status!: "Not Started" | "Started" | "InProgress" | "Canceled" | "Onhold" | "Completed";

    @Column({
        type: DataType.ENUM("Approved", "Not Approved", "Pending"),
        defaultValue: "Pending",
        allowNull: false,
    })
    approvalStatus!: "Approved" | "Not Approved" | "Pending";

    @BelongsToMany(() => User, {
        through: () => ActivityMember,
        foreignKey: "activity_id",
        otherKey: "user_id",
    })
    assignedUsers!: User[];

    @HasMany(() => Request)
    requests?: Request[];

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    image?: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    labor_index_factor?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    labor_utilization_factor?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    labor_working_hours_per_day?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    machinery_index_factor?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    machinery_utilization_factor?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    machinery_working_hours_per_day?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    labor_cost?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    material_cost?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    equipment_cost?: number;

    @Column({
        type: DataType.VIRTUAL,
        get() {
            return (this.getDataValue('labor_cost') || 0) + (this.getDataValue('material_cost') || 0) + (this.getDataValue('equipment_cost') || 0);
        },
    })
    total_cost?: number;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    work_force?: WorkForceItem[];

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    machinery_list?: MachineryItem[];

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    materials_list?: MaterialItem[];

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    checked_by_name?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    checked_by_date?: Date;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    actuals?: Actuals | null;

    // NEW: progressUpdates JSONB column
    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    progressUpdates?: ProgressUpdateItem[] | null;

    // BeforeUpdate hook: append progress update entry if progress changed,
    // or if options.progressUpdate is provided append that object.
    @BeforeUpdate
    static async handleProgressUpdates(instance: Activity, options: any) {
        try {
            const userIdFromOptions: string | undefined = options?.userId;

            // Try using the public `previous()` API first (typed), else fallback to getDataValue
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
                    checkedBy: instance.getDataValue("checked_by_name") ?? undefined,
                    status: instance.getDataValue("status") ?? undefined,
                    userId: userIdFromOptions,
                };
                workingUpdates.push(item);
                instance.setDataValue("progressUpdates", workingUpdates);
            }
        } catch (err) {
            // don't block update on hook errors; log for troubleshooting
            // eslint-disable-next-line no-console
            console.warn("Error in Activity.handleProgressUpdates hook:", err);
        }
    }

    // Hook for creating an activity
    @AfterCreate
    static async logCreate(instance: Activity, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Created",
            "Activity",
            `Activity "${instance.activity_name}" created`
        );
    }

    // Hook for updating an activity
    @AfterUpdate
    static async logUpdate(instance: Activity, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Updated",
            "Activity",
            `Activity "${instance.activity_name}" updated`
        );
    }

    // Hook for deleting an activity
    @AfterDestroy
    static async logDestroy(instance: Activity, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Deleted",
            "Activity",
            `Activity "${instance.activity_name}" deleted`
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

export default Activity;
