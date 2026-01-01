import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    HasMany,
    Default,
} from "sequelize-typescript";
import Department from "./Department.model";
import User from "./User.model";
import Approval from "./Approval.model";
import Activity from "./Activity.model";
import Site from "./Site.model";

export interface IRequest {
    id: string;
    userId: string;
    departmentId?: string;
    siteId?: string;
    activityId?: string;
    materialCount?: number;
    laborCount?: number;
    equipmentCount?: number;
    status: "Pending" | "In Progress" | "Completed" | "Rejected";
    priority?: "Urgent" | "Medium" | "Low"
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

    @ForeignKey(() => Site)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    siteId?: string;
    @BelongsTo(() => Site)
    site?: Site;

    @ForeignKey(() => Activity)
    @Column({ type: DataType.UUID, allowNull: true })
    activityId?: string;
    @BelongsTo(() => Activity)
    activity?: Activity;

    @Column({
        type: DataType.STRING,
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
