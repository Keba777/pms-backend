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
import Organization from "./Organization.model";

export interface IBudget {
    id: string;
    project_id: string;
    project?: Project;
    allocated_amount: number;
    spent_amount: number;
    remaining_amount: number;
    description?: string;
    status: "Planned" | "Active" | "Closed";
    orgId?: string;
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

    @Column(DataType.TEXT)
    description?: string;

    @Default("Active")
    @Column(DataType.STRING)
    status!: "Planned" | "Active" | "Closed";

    @ForeignKey(() => Organization)
    @Column(DataType.UUID)
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Budget;
