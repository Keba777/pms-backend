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
}

@Table({ tableName: 'kpis', timestamps: true })
class KPI extends Model<IKPI> implements IKPI {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column(DataType.ENUM('Labor', 'Machinery'))
    type!: 'Labor' | 'Machinery';

    @Column(DataType.INTEGER)
    score!: number;

    @Column(DataType.ENUM('Bad', 'Good', 'V.Good', 'Excellent'))
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
}

export default KPI;
