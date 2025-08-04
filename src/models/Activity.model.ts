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
} from "sequelize-typescript";
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
    work_force?: WorkForceItem[];
    machinery_list?: MachineryItem[];
    materials_list?: MaterialItem[];
    checked_by_name?: string;
    checked_by_date?: Date;
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
