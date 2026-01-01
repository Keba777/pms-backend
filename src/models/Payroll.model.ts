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
import Project from "./Project.model";
import User from "./User.model";

export interface IPayroll {
    id: string;
    project_id: string;
    project?: Project;
    user_id: string;
    user?: User;
    amount: number;
    pay_period: string;
    status: "pending" | "paid";
}

@Table({ tableName: "payrolls", timestamps: true })
class Payroll extends Model<IPayroll> implements IPayroll {
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
    user_id!: string;

    @BelongsTo(() => User)
    user!: User;

    @Column(DataType.DECIMAL(12, 2))
    amount!: number;

    @Column(DataType.STRING(20))
    pay_period!: string;

    @Default("pending")
    @Column(DataType.STRING)
    status!: "pending" | "paid";
}

export default Payroll;
