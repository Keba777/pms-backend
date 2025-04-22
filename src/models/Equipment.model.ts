import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
} from "sequelize-typescript";

export interface IEquipment {
    id: string;
    item: string;
    unit: string;
    minQuantity?: number;       // now optional
    estimatedHours?: number;    // now optional
    rate?: number;              // now optional
    totalAmount?: number;       // now optional
}

@Table({ tableName: "equipments", timestamps: true })
class Equipment extends Model<IEquipment> implements IEquipment {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    item!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @Column({ type: DataType.DECIMAL(8, 2), allowNull: true })
    estimatedHours?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    rate?: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    totalAmount?: number;
}

export default Equipment;