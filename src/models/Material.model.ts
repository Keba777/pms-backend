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
    quantity?: number;
    minQuantity?: number;
    reorderQuantity?: number;
    outOfStore?: number;
    rate?: number;
    shelfNo?: string;
    status?: "Active" | "Inactive";
    totalPrice?: number;
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
    quantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    reorderQuantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    outOfStore?: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    rate?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    shelfNo?: string;

    @Column({
        type: DataType.ENUM('Active', 'Inactive'),
        allowNull: true,
        defaultValue: 'Active',
    })
    status?: 'Active' | 'Inactive';

    @Column({
        type: DataType.VIRTUAL(DataType.DECIMAL(12, 2)),
        get(this: Material) {
            const q = this.getDataValue("quantity") || 0;
            const r = parseFloat(this.getDataValue("rate") as any) || 0;
            return (q * r).toFixed(2);
        },
    })
    totalPrice?: number;
}

export default Material;