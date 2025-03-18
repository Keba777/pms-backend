// Timesheet.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import LaborManagement from "./LaborManagement.model";

@Table({ tableName: "timesheets" })
class Timesheet extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @ForeignKey(() => LaborManagement)
    @Column(DataType.UUID)
    labor_id!: string;

    @BelongsTo(() => LaborManagement)
    labor!: LaborManagement;

    @Column(DataType.DATEONLY)
    date!: Date;

    @Column(DataType.DECIMAL(5, 2))
    hours_worked!: number;

    @Column(DataType.STRING(50))
    site!: string;

    @Column(DataType.ENUM('Present', 'Absent', 'Late', 'On Leave'))
    status!: string;

    @Column(DataType.TEXT)
    remarks!: string;
}