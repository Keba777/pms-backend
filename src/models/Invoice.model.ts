import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import Project from "./Project.model";
import User from "./User.model";
import Payment from "./Payment.model";
import Organization from "./Organization.model";

export interface IInvoice {
    id: string;
    project_id: string;
    project?: Project;
    created_by: string;
    user?: User;
    type: "income" | "expense";
    amount: number;
    due_date: Date;
    status: "pending" | "paid" | "overdue";
    description?: string;
    gross_amount: number;
    vat_amount: number;
    withholding_amount: number;
    retention_amount: number;
    advance_recovery_amount: number;
    net_amount: number;
    payments?: Payment[];
    orgId?: string;
}

@Table({ tableName: "invoices", timestamps: true })
class Invoice extends Model<IInvoice> implements IInvoice {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    project_id!: string;

    @BelongsTo(() => Project)
    project!: Project;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    created_by!: string;

    @BelongsTo(() => User)
    user!: User;

    @Column(DataType.STRING)
    type!: "income" | "expense";

    @Column(DataType.DECIMAL(12, 2))
    amount!: number;

    @Column(DataType.DATE)
    due_date!: Date;

    @Default("pending")
    @Column(DataType.STRING)
    status!: "pending" | "paid" | "overdue";

    @Column(DataType.TEXT)
    description?: string;

    @Column(DataType.DECIMAL(12, 2))
    gross_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    vat_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    withholding_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    retention_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    advance_recovery_amount!: number;

    @Column(DataType.DECIMAL(12, 2))
    net_amount!: number;

    @HasMany(() => Payment)
    payments!: Payment[];

    @ForeignKey(() => Organization)
    @Column(DataType.UUID)
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Invoice;
