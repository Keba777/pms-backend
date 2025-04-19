// models/Material.model.ts
import {
    Table, Column, Model, DataType, PrimaryKey,
    ForeignKey, BelongsTo
} from "sequelize-typescript";
import Activity from "./Activity.model";
import Request from "./Request.model";
import Warehouse from "./Warehouse.model";

export interface IMaterial {
    id: string;
    activityId: string;
    requestId: string;
    warehouseId?: string;

    item: string;
    unit: string;
    requestQuantity: number;
    minQuantity: number;
    rate: number;
    totalAmount: number;
}

@Table({ tableName: "materials", timestamps: true })
class Material extends Model<IMaterial> implements IMaterial {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @ForeignKey(() => Activity)
    @Column({ type: DataType.UUID, allowNull: false })
    activityId!: string;
    @BelongsTo(() => Activity)
    activity!: Activity;

    @ForeignKey(() => Request)
    @Column({ type: DataType.UUID, allowNull: false })
    requestId!: string;
    @BelongsTo(() => Request)
    request!: Request;

    @ForeignKey(() => Warehouse)
    @Column({ type: DataType.UUID, allowNull: false })
    warehouseId!: string;
    @BelongsTo(() => Warehouse)
    warehouse!: Warehouse;

    @Column({ type: DataType.STRING, allowNull: false })
    item!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    requestQuantity!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    minQuantity!: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    rate!: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
    totalAmount!: number;
}

export default Material;