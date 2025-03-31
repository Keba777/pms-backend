import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Activity from "./Activity.model";

export interface IMaterial {
    id: string;
    quantity: number;
    warehouse_id: string;
    item: string;
    rate_with_vat: number;
    unit: string;
    activity_id: string;
    financial_status?: "Approved" | "Not Approved";
}

@Table({ tableName: "materials", timestamps: true })
class Material extends Model<IMaterial> implements IMaterial {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    warehouse_id!: string;

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
        type: DataType.STRING,
        allowNull: false,
    })
    unit!: string;

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

export default Material;
