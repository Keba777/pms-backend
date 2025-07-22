import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Site from "./Site.model";

export interface IEquipment {
    id: string;
    item: string;
    siteId: string;
    site?: Site;
    type?: string;
    unit: string;
    manufacturer?: string;
    model?: string;
    year?: string;
    quantity?: number;
    minQuantity?: number;
    reorderQuantity?: number;
    outOfStore?: number;
    estimatedHours?: number;
    rate?: number;
    totalAmount?: number;
    overTime?: number;
    condition?: string;
    owner?: "Raycon" | "Rental";
    status?: "Allocated" | "Unallocated" | "OnMaintainance" | "InActive";
    utilization_factor?: number; // New field: Utilization Factor
    totalTime?: number; // New field: Total Time
    startingDate?: Date; // New field: Starting Date
    dueDate?: Date; // New field: Due Date
    shiftingDate?: Date; // New field: Shifting Date
}

@Table({ tableName: "equipments", timestamps: true })
class Equipment extends Model<IEquipment> implements IEquipment {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    item!: string;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;

    @BelongsTo(() => Site)
    site!: Site;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.STRING, allowNull: true })
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

    @Column({ type: DataType.INTEGER, allowNull: true })
    reorderQuantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    outOfStore?: number;

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
    status?: "Allocated" | "Unallocated" | "OnMaintainance" | "InActive";

    @Column({ type: DataType.DECIMAL(8, 2), allowNull: true })
    utilization_factor?: number; // Utilization Factor

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true,
        get() {
            const explicitTotalTime = this.getDataValue('totalTime');
            if (explicitTotalTime !== undefined && explicitTotalTime !== null) {
                return explicitTotalTime;
            }
            // If totalTime is not set, calculate it based on estimatedHours
            const estimatedHours = this.getDataValue('estimatedHours');
            return estimatedHours ? parseFloat(estimatedHours.toFixed(2)) : null;
        }
    })
    totalTime?: number; // Total Time, defaults to estimatedHours if not provided

    @Column({ type: DataType.DATE, allowNull: true })
    startingDate?: Date; // Starting Date

    @Column({ type: DataType.DATE, allowNull: true })
    dueDate?: Date; // Due Date

    @Column({ type: DataType.DATE, allowNull: true })
    shiftingDate?: Date; // Shifting Date
}

export default Equipment;