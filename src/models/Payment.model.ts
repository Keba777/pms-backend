import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Invoice from "./Invoice.model";
import User from "./User.model";

export interface IPayment {
    id: string;
    invoice_id: string;
    invoice?: Invoice;
    recorded_by: string;
    user?: User;
    amount_paid: number;
    payment_date: Date;
    method: "cash" | "bank_transfer" | "check" | "mobile_money";
    reference_number?: string;
}

@Table({ tableName: "payments", timestamps: true })
class Payment extends Model<IPayment> implements IPayment {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @ForeignKey(() => Invoice)
    @Column(DataType.UUID)
    invoice_id!: string;

    @BelongsTo(() => Invoice)
    invoice!: Invoice;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    recorded_by!: string;

    @BelongsTo(() => User)
    user!: User;

    @Column(DataType.DECIMAL(12, 2))
    amount_paid!: number;

    @Column(DataType.DATE)
    payment_date!: Date;

    @Column(DataType.ENUM("cash", "bank_transfer", "check", "mobile_money"))
    method!: "cash" | "bank_transfer" | "check" | "mobile_money";

    @Column(DataType.STRING(100))
    reference_number?: string;
}

export default Payment;
