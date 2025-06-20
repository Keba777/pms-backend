import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import Approval from "./Approval.model";

export interface IStoreRequisition {
    id: string;
    description?: string;
    unitOfMeasure: string;
    quantity: number;
    remarks?: string;
    approvalId: string;
}

@Table({
    tableName: "store_requisitions",
    timestamps: true,
})
class StoreRequisition
    extends Model<IStoreRequisition>
    implements IStoreRequisition {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({ type: DataType.UUID })
    id!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    unitOfMeasure!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    quantity!: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;

    @ForeignKey(() => Approval)
    @Column({ type: DataType.UUID, allowNull: false })
    approvalId!: string;

    @BelongsTo(() => Approval)
    approval!: Approval;
}

export default StoreRequisition;
