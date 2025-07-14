import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import Site from './Site.model';
import LaborInformation from './LaborInformation.model';

export interface ILabor {
    id: string;
    role: string;
    siteId: string;
    site?: Site
    unit: string;
    quantity?: number
    minQuantity?: number;
    estimatedHours?: number;
    rate?: number;
    overtimeRate?: number
    totalAmount?: number;
    skill_level?: string;
    responsiblePerson?: string
    laborInformations?: LaborInformation[];
    allocationStatus?: "Allocated" | "Unallocated" | "OnLeave"
    status?: "Active" | "InActive"
}

@Table({ tableName: 'labors', timestamps: true })
class Labor extends Model<ILabor> implements ILabor {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: string;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;
    @BelongsTo(() => Site)
    site!: Site;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @Column({ type: DataType.DECIMAL(8, 2), allowNull: true })
    estimatedHours?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    rate?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    overtimeRate?: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    totalAmount?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    skill_level?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    responsiblePerson?: string;

    @HasMany(() => LaborInformation)
    laborInformations!: LaborInformation[];

    @Column({
        type: DataType.ENUM('Allocated', 'Unallocated', 'OnLeave'),
        allowNull: true,
        defaultValue: "Unallocated",
    })
    allocationStatus?: "Allocated" | "Unallocated" | "OnLeave"

    @Column({
        type: DataType.ENUM('Active', 'InActive'),
        allowNull: true,
        defaultValue: "InActive",
    })
    status?: "Active" | "InActive"
}

export default Labor;