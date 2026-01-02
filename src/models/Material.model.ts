import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    BeforeSave,
} from 'sequelize-typescript';
import Warehouse from './Warehouse.model';
import Organization from './Organization.model';

export interface IMaterial {
    id: string;
    warehouseId?: string;
    item: string;
    type?: string;
    unit: string;
    quantity?: number;
    minQuantity?: number;
    reorderQuantity?: number;
    outOfStore?: number;
    rate?: number;
    shelfNo?: string;
    status?: 'Available' | 'Unavailable';
    totalPrice?: number;
    orgId?: string;
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
    type?: string;

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
        type: DataType.STRING,
        allowNull: true,
        defaultValue: 'Unavailable',
    })
    status?: 'Available' | 'Unavailable';

    @Column({
        type: DataType.VIRTUAL(DataType.DECIMAL(12, 2)),
        get(this: Material) {
            const q = this.getDataValue("quantity") || 0;
            const r = parseFloat(this.getDataValue("rate") as any) || 0;
            return (q * r).toFixed(2);
        },
    })
    totalPrice?: number;

    @BeforeSave
    static updateStatus(material: Material) {
        const quantity = material.quantity ?? 0;
        material.status = quantity > 0 ? 'Available' : 'Unavailable';
    }

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Material;
