import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Activity from "./Activity.model";

export interface ILabor {
    id: string;
    total_labor: number;
    hourly_rate: number;
    skill_level?: string;
    activity_id: string;
    financial_status?: "Approved" | "Not Approved";
}

@Table({ tableName: "labors", timestamps: true })
class Labor extends Model<ILabor> implements ILabor {
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
    total_labor!: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    hourly_rate!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    skill_level?: string;

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

export default Labor;
