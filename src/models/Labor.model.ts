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
import Organization from './Organization.model';

export interface ILabor {
    id: string;
    role: string;
    siteId: string;
    site?: Site;
    unit: string;
    quantity?: number;
    minQuantity?: number;
    estimatedHours?: number;
    rate?: number;
    overtimeRate?: number;
    totalAmount?: number;
    skill_level?: string;
    responsiblePerson?: string;
    laborInformations?: LaborInformation[];
    allocationStatus?: "Allocated" | "Unallocated" | "OnLeave";
    status?: "Active" | "InActive";
    utilization_factor?: number;
    totalTime?: number;
    startingDate?: Date;
    dueDate?: Date;
    shiftingDate?: Date;
    orgId?: string;
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
    quantity?: number;

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

    @Column({ type: DataType.STRING, allowNull: true, field: 'skill_level' })
    skill_level?: string;

    @Column({ type: DataType.STRING, allowNull: true, field: 'responsible_person' })
    responsiblePerson?: string;

    @HasMany(() => LaborInformation)
    laborInformations!: LaborInformation[];

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "Unallocated",
    })
    allocationStatus?: "Allocated" | "Unallocated" | "OnLeave";

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "InActive",
    })
    status?: "Active" | "InActive";

    @Column({ type: DataType.DECIMAL(8, 2), allowNull: true, field: 'utilization_factor' })
    utilization_factor?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true,
        field: 'total_time',
        get() {
            const explicitTotalTime = this.getDataValue('total_time');
            if (explicitTotalTime !== null && explicitTotalTime !== undefined) {
                return Number(explicitTotalTime.toFixed(2));
            }
            const estimatedHours = this.getDataValue('estimatedHours');
            if (typeof estimatedHours === 'number' && !isNaN(estimatedHours)) {
                return Number(estimatedHours.toFixed(2));
            }
            return null;
        }
    })
    totalTime?: number;

    @Column({ type: DataType.DATE, allowNull: true, field: 'starting_date' })
    startingDate?: Date;

    @Column({ type: DataType.DATE, allowNull: true, field: 'due_date' })
    dueDate?: Date;

    @Column({ type: DataType.DATE, allowNull: true, field: 'shifting_date' })
    shiftingDate?: Date;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Labor;