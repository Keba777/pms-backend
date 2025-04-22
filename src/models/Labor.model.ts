import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
} from 'sequelize-typescript';

export interface ILabor {
    id: string;
    role: string;
    unit: string;
    minQuantity?: number;
    estimatedHours?: number;
    rate?: number;
    totalAmount?: number;
    skill_level?: string;
}

@Table({ tableName: 'labors', timestamps: true })
class Labor extends Model<ILabor> implements ILabor {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: string;

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

    @Column({ type: DataType.STRING, allowNull: true })
    skill_level?: string;
}

export default Labor;