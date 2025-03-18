// Invoice.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import LaborManagement from "./LaborManagement.model";

@Table({ tableName: "invoices" })
class Invoice extends Model {
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

    @Column(DataType.DECIMAL(12, 2))
    amount!: number;

    @Column(DataType.ENUM('Pending', 'Paid', 'Overdue', 'Cancelled'))
    status!: string;

    @Column(DataType.DATE)
    due_date!: Date;

    @Column(DataType.STRING(20))
    invoice_number!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column(DataType.DATE)
    payment_date!: Date;

    @Column(DataType.STRING(50))
    payment_method!: string;
}

export default Invoice;