import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Equipment from "./Equipment.model";

export interface IWarehouse {
    id: string;
    type: string;
    owner: string;
    workingStatus: 'Operational' | 'Non-Operational';
    currentWorkingSite: string;
    approvedBy?: string;
    remark?: string;
    status: 'Active' | 'Inactive' | 'Under Maintenance';
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    owner!: string;

    @Column({
        type: DataType.ENUM('Operational', 'Non-Operational'),
        allowNull: false,
    })
    workingStatus!: 'Operational' | 'Non-Operational';

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    currentWorkingSite!: string;

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
        type: DataType.ENUM('Active', 'Inactive', 'Under Maintenance'),
        allowNull: false,
    })
    status!: 'Active' | 'Inactive' | 'Under Maintenance';
}

export default Warehouse;
