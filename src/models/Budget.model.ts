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

export interface IBudget {
    id: string;
    project_id: string;
    project?: Project;
    allocated_amount: number;
    spent_amount: number;
    remaining_amount: number;
}

@Table({ tableName: "budgets", timestamps: true })
class Budget extends Model<IBudget> implements IBudget {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    project_id!: string;

    @BelongsTo(() => Project)
    project!: Project;

    @Column(DataType.DECIMAL(12, 2))
    allocated_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    spent_amount!: number;

    @Default(0)
    @Column(DataType.DECIMAL(12, 2))
    remaining_amount!: number;
}

export default Budget;
