import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

export interface IDepartment {
    id: string;
    name: string;
    description?: string;
    status?: "Active" | "Inactive" | "Pending";
    subDepartment?: {
        name: string;
        description?: string;
    };
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
        type: DataType.ENUM("Active", "Inactive", "Pending"),
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
}

export default Department;
