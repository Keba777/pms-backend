import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Organization from "./Organization.model";

export interface IDepartment {
    id: string;
    name: string;
    description?: string;
    status?: "Active" | "Inactive" | "Pending";
    subDepartment?: {
        name: string;
        description?: string;
    };
    orgId?: string;
}

@Table({ tableName: "departments", timestamps: true })
class Department extends Model<IDepartment> implements IDepartment {
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
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    status?: "Active" | "Inactive" | "Pending";

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    subDepartment?: {
        name: string;
        description?: string;
    };

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Department;
