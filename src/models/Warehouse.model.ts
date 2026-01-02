import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Site from "./Site.model";
import Organization from "./Organization.model";

export interface IWarehouse {
    id: string;
    type: string;
    siteId?: string;
    owner: string;
    workingStatus: 'Operational' | 'Non-Operational';
    approvedBy?: string;
    remark?: string;
    status: 'Active' | 'Inactive' | 'Under Maintenance';
    orgId?: string;
}

@Table({ tableName: "warehouses", timestamps: true })
class Warehouse extends Model<IWarehouse> implements IWarehouse {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    type!: string;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;
    @BelongsTo(() => Site)
    site!: Site;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    owner!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    workingStatus!: 'Operational' | 'Non-Operational';


    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    approvedBy?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    remark?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status!: 'Active' | 'Inactive' | 'Under Maintenance';

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Warehouse;
