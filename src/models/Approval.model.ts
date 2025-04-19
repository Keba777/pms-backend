// models/Approval.model.ts
import {
    Table, Column, Model, DataType, PrimaryKey,
    ForeignKey, BelongsTo
} from "sequelize-typescript";
import Request from "./Request.model";
import Department from "./Department.model";

export interface IApproval {
    id: string;
    requestId: string;
    departmentId: string;
    stepOrder: number;
    status: "Pending" | "Approved" | "Rejected";
    approvedBy?: string;
    approvedAt?: Date;
    remarks?: string;
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

    @Column({ type: DataType.STRING, allowNull: true })
    approvedBy?: string;

    @Column({ type: DataType.DATE, allowNull: true })
    approvedAt?: Date;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;
}

export default Approval;