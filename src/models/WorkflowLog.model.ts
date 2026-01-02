import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    Default,
} from "sequelize-typescript";
import User from "./User.model";
import Organization from "./Organization.model";

export interface IWorkflowLog {
    id?: string;
    entityType: "Project" | "Task" | "Activity" | "Approval";
    entityId: string;
    action: string;
    status?: string;
    userId: string;
    details?: string;
    orgId?: string;
}

@Table({ tableName: "workflow_logs", timestamps: true })
class WorkflowLog extends Model<IWorkflowLog> implements IWorkflowLog {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    entityType!: "Project" | "Task" | "Activity" | "Approval";

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    entityId!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    action!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    status?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    @BelongsTo(() => User)
    user?: User;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    timestamp!: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    details?: string;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default WorkflowLog;