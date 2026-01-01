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
    payments?: Payment[];
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

    @HasMany(() => Payment)
    payments!: Payment[];
}

export default Invoice;
