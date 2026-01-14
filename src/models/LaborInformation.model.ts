import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import Labor from './Labor.model';
import Organization from './Organization.model';

export interface ILaborInformation {
    id: string;
    firstName: string;
    lastName: string;
    laborId: string;
    startsAt: Date;
    endsAt: Date;
    status: 'Allocated' | 'Unallocated' | 'OnLeave';
    profile_picture?: string;
    position?: string;
    sex?: 'Male' | 'Female';
    phone?: string;
    terms?: 'Part Time' | 'Contract' | 'Temporary' | 'Permanent';
    estSalary?: number;
    educationLevel?: string;
    estimatedHours?: number;
    rate?: number;
    overtimeRate?: number;
    totalAmount?: number;
    skill_level?: string;
    utilization_factor?: number;
    totalTime?: number;
    shiftingDate?: Date;
    orgId?: string;
}

@Table({ tableName: 'labor_informations', timestamps: true })
class LaborInformation extends Model<ILaborInformation> implements ILaborInformation {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string;

    @ForeignKey(() => Labor)
    @Column({ type: DataType.UUID, allowNull: false })
    laborId!: string;

    @BelongsTo(() => Labor)
    labor!: Labor;

    @Column({ type: DataType.DATE, allowNull: false })
    startsAt!: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    endsAt!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "Unallocated",
    })
    status!: 'Allocated' | 'Unallocated' | 'OnLeave';

    @Column({ type: DataType.STRING, allowNull: true })
    profile_picture?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    position?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    sex?: 'Male' | 'Female';

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    terms?: 'Part Time' | 'Contract' | 'Temporary' | 'Permanent';

    @Column({ type: DataType.FLOAT, allowNull: true })
    estSalary?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    educationLevel?: string;

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

    @Column({ type: DataType.DATE, allowNull: true, field: 'shifting_date' })
    shiftingDate?: Date;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default LaborInformation;
