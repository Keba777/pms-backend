import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import User from './User.model';
import LaborInformation from './LaborInformation.model';
import Equipment from './Equipment.model';
import Organization from './Organization.model';

export interface IKPI {
    id: string;
    type: 'Labor' | 'Machinery';
    score: number;
    status: 'Bad' | 'Good' | 'V.Good' | 'Excellent';
    remark?: string;
    userLaborId?: string;
    laborInfoId?: string;
    equipmentId?: string;
    target?: number;
    orgId?: string;
}

@Table({ tableName: 'kpis', timestamps: true })
class KPI extends Model<IKPI> implements IKPI {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column(DataType.STRING)
    type!: 'Labor' | 'Machinery';

    @Column(DataType.INTEGER)
    score!: number;

    @Column(DataType.STRING)
    status!: 'Bad' | 'Good' | 'V.Good' | 'Excellent';

    @Column(DataType.TEXT)
    remark?: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    userLaborId?: string;

    @BelongsTo(() => User, 'userLaborId')
    userLabor?: User;

    @ForeignKey(() => LaborInformation)
    @Column({ type: DataType.UUID, allowNull: true })
    laborInfoId?: string;

    @BelongsTo(() => LaborInformation, 'laborInfoId')
    laborInformation?: LaborInformation;

    @ForeignKey(() => Equipment)
    @Column({ type: DataType.UUID, allowNull: true })
    equipmentId?: string;

    @BelongsTo(() => Equipment, 'equipmentId')
    equipment?: Equipment;

    @Column({ type: DataType.INTEGER, allowNull: true })
    target?: number;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default KPI;
