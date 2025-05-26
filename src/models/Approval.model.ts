// models/Approval.model.ts
import {
    Table, Column, Model, DataType, PrimaryKey,
    ForeignKey, BelongsTo
} from "sequelize-typescript";
import Request from "./Request.model";
import Department from "./Department.model";
import User from "./User.model";

export interface IApproval {
    id: string;
    requestId: string;
    departmentId: string;
    stepOrder: number;
    status: "Pending" | "Approved" | "Rejected";
    approvedBy?: string;
    approvedByUser?: User;
    approvedAt?: Date;
    checkedBy?: string
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
    @Column({ type: DataType.UUID, allowNull: false })
    approvedBy?: string;
    @BelongsTo(() => User)
    approvedByUser!: User;

    @Column({ type: DataType.DATE, allowNull: true })
    approvedAt?: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    checkedBy!: string;
    @BelongsTo(() => User)
    checkedByUser!: User;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    prevDepartmentId?: string;
    @BelongsTo(() => Department)
    prevDepartment!: Department;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    nextDepartmentId?: string;
    @BelongsTo(() => Department)
    nextDepartment!: Department;

    @Column({ type: DataType.BOOLEAN, allowNull: true })
    finalDepartment?: boolean;
}

export default Approval;