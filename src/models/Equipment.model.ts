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
    type?: string
    unit: string;
    manufacturer?: string;
    model?: string
    year?: string;
    quantity?: number
    minQuantity?: number;
    estimatedHours?: number;
    rate?: number;
    totalAmount?: number;
    overTime?: number;
    condition?: string
    owner?: "Raycon" | "Rental"
    status?: "Allocated" | "Unallocated" | "OnMaintainance" | "InActive"
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

    @Column({ type: DataType.STRING, allowNull: false })
    type?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    manufacturer?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    model?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    year?: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    quantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @Column({ type: DataType.DECIMAL(8, 2), allowNull: true })
    estimatedHours?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    rate?: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    totalAmount?: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    overTime?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    condition?: string;

    @Column({
        type: DataType.ENUM('Raycon', 'Rental'),
        allowNull: true,
        defaultValue: 'Raycon',
    })
    owner?: 'Raycon' | 'Rental';

    @Column({
        type: DataType.ENUM('Allocated', 'Unallocated', 'OnMaintainance', 'InActive'),
        allowNull: true,
        defaultValue: "Unallocated",
    })
    status?: "Allocated" | "Unallocated" | "OnMaintainance" | "InActive"
}

export default Equipment;