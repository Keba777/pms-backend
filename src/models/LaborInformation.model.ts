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

export interface ILaborInformation {
    id: string;
    firstName: string;
    lastName: string;
    laborId: string;
    startsAt: Date;
    endsAt: Date;
    status: 'Allocated' | 'Unallocated';
    profile_picture?: string;
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
        type: DataType.ENUM('Allocated', 'Unallocated'),
        allowNull: false,
    })
    status!: 'Allocated' | 'Unallocated';

    @Column({ type: DataType.STRING, allowNull: true })
    profile_picture?: string;
}

export default LaborInformation;
