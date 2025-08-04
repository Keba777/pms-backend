import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
} from "sequelize-typescript";
import Request from "./Request.model";
import Department from "./Department.model";
import User from "./User.model";
import WorkflowLog from "./WorkflowLog.model";

export interface IApproval {
    id: string;
    requestId: string;
    departmentId: string;
    stepOrder: number;
    status: "Pending" | "Approved" | "Rejected";
    approvedBy?: string;
    approvedByUser?: User;
    approvedAt?: Date;
    checkedBy?: string;
    checkedByUser?: User;
    remarks?: string;
    prevDepartmentId?: string;
    prevDepartment?: Department;
    nextDepartmentId?: string;
    nextDepartment?: Department;
    finalDepartment?: boolean;
}

@Table({ tableName: "approvals", timestamps: true })
class Approval extends Model<IApproval> implements IApproval {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @ForeignKey(() => Request)
    @Column({ type: DataType.UUID, allowNull: false })
    requestId!: string;

    @BelongsTo(() => Request)
    request!: Request;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: false })
    departmentId!: string;

    @BelongsTo(() => Department)
    department!: Department;

    @Column({ type: DataType.INTEGER, allowNull: false })
    stepOrder!: number;

    @Column({
        type: DataType.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
    })
    status!: IApproval["status"];

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    approvedBy?: string;

    @BelongsTo(() => User, "approvedBy")
    approvedByUser!: User;

    @Column({ type: DataType.DATE, allowNull: true })
    approvedAt?: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    checkedBy?: string;

    @BelongsTo(() => User, "checkedBy")
    checkedByUser!: User;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    prevDepartmentId?: string;

    @BelongsTo(() => Department, "prevDepartmentId")
    prevDepartment!: Department;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    nextDepartmentId?: string;

    @BelongsTo(() => Department, "nextDepartmentId")
    nextDepartment!: Department;

    @Column({ type: DataType.BOOLEAN, allowNull: true })
    finalDepartment?: boolean;

    // Hook for creating an approval
    @AfterCreate
    static async logCreate(instance: Approval, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Created",
            "Approval",
            `Approval for request "${instance.requestId}" created in department "${instance.departmentId}"`
        );
    }

    // Hook for updating an approval
    @AfterUpdate
    static async logUpdate(instance: Approval, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Updated",
            "Approval",
            `Approval for request "${instance.requestId}" updated to status "${instance.status}"`
        );
    }

    // Hook for deleting an approval
    @AfterDestroy
    static async logDestroy(instance: Approval, options: any) {
        await createWorkflowLogHook(
            instance,
            options,
            "Deleted",
            "Approval",
            `Approval for request "${instance.requestId}" deleted from department "${instance.departmentId}"`
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

export default Approval;