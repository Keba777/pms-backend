// models/Request.model.ts
import {
    Table, Column, Model, DataType, PrimaryKey,
    ForeignKey, BelongsTo, HasMany, CreatedAt
} from "sequelize-typescript";
import Department from "./Department.model";
import User from "./User.model";
import Labor from "./Labor.model";
import Material from "./Material.model";
import Equipment from "./Equipment.model";
import Approval from "./Approval.model";

export interface IRequest {
    id: string;
    reqNumber: string;
    date: Date;
    userId: string;
    departmentId: string;
    status: "Pending" | "In Progress" | "Completed" | "Rejected";
}

@Table({ tableName: "requests", timestamps: true })
class Request extends Model<IRequest> implements IRequest {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    reqNumber!: string;

    @Column({ type: DataType.DATE, allowNull: false })
    date!: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;
    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => Department)
    @Column({ type: DataType.UUID, allowNull: false })
    departmentId!: string;
    @BelongsTo(() => Department)
    department!: Department;

    @Column({
        type: DataType.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
    })
    status!: IRequest["status"];

    @HasMany(() => Labor)
    labors!: Labor[];

    @HasMany(() => Material)
    materials!: Material[];

    @HasMany(() => Equipment)
    equipment!: Equipment[];

    @HasMany(() => Approval)
    approvals!: Approval[];

}

export default Request;