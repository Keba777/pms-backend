import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Activity from "./Activity.model";

export interface IEquipment {
    id: string;
    item: string;
    rate_with_vat: number;
    reorder_quantity: number;
    min_quantity: number;
    manufacturer?: string;
    year?: number;
    eqp_condition?: string;
    activity_id: string;
    financial_status?: "Approved" | "Not Approved";
}

@Table({ tableName: "equipments", timestamps: true })
class Equipment extends Model<IEquipment> implements IEquipment {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    item!: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    rate_with_vat!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    reorder_quantity!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    min_quantity!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    manufacturer?: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    year?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    eqp_condition?: string;

    // Foreign key association with Activity
    @ForeignKey(() => Activity)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    activity_id!: string;

    @BelongsTo(() => Activity)
    activity!: Activity;

    @Column({
        type: DataType.ENUM("Approved", "Not Approved"),
        allowNull: true,
    })
    financial_status?: "Approved" | "Not Approved";
}

export default Equipment;
