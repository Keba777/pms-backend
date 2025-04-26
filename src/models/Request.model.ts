import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import Department from "./Department.model";
import User from "./User.model";
import Approval from "./Approval.model";
import Activity from "./Activity.model";

export interface IRequest {
    id: string;
    userId: string;
    departmentId?: string;
    activityId?: string;
    materialCount?: number;
    laborCount?: number;
    equipmentCount?: number;
    status: "Pending" | "In Progress" | "Completed" | "Rejected";
    laborIds?: string[];
    materialIds?: string[];
    equipmentIds?: string[];
}

@Table({ tableName: "requests", timestamps: true })
class Request extends Model<IRequest> implements IRequest {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.INTEGER, allowNull: true, })
    materialCount?: number;

    @Column({ type: DataType.INTEGER, allowNull: true, })
    laborCount?: number;

    @Column({ type: DataType.INTEGER, allowNull: true, })
    equipmentCount?: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;
    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: true })
    departmentId?: string;
    @BelongsTo(() => Department)
    department?: Department;

    @ForeignKey(() => Activity)
    @Column({ type: DataType.UUID, allowNull: true })
    activityId?: string;
    @BelongsTo(() => Activity)
    activity?: Activity;

    @Column({
        type: DataType.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
    })
    status!: IRequest["status"];

    @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: true })
    laborIds?: string[];

    @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: true })
    materialIds?: string[];

    @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: true })
    equipmentIds?: string[];

    @HasMany(() => Approval)
    approvals!: Approval[];
}

export default Request;
