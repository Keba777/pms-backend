import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import Warehouse from './Warehouse.model';

export interface IMaterial {
    id: string;
    warehouseId?: string;
    item: string;
    unit: string;
    minQuantity?: number;    // now optional
    rate?: number;           // now optional
    totalAmount?: number;    // now optional
}

@Table({ tableName: 'materials', timestamps: true })
class Material extends Model<IMaterial> implements IMaterial {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @ForeignKey(() => Warehouse)
    @Column({ type: DataType.UUID, allowNull: false })
    warehouseId!: string;
    @BelongsTo(() => Warehouse)
    warehouse!: Warehouse;

    @Column({ type: DataType.STRING, allowNull: false })
    item!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    rate?: number;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    totalAmount?: number;
}

export default Material;