// LaborManagement.model.ts
import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";
@Table({ tableName: "labor_management" })
class LaborManagement extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    site!: string;

    @Column(DataType.ENUM('Skilled', 'Unskilled'))
    skill!: string;

    @Column(DataType.DECIMAL(10, 2))
    salary!: number;

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;

    @Column(DataType.ENUM('Active', 'Inactive', 'On Leave'))
    status!: string;
}

export default LaborManagement;