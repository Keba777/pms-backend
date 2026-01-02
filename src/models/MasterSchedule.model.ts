import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Organization from "./Organization.model";

export interface IMasterSchedule {
    id: string;
    schedule_type: "Project" | "Task" | "Activity"; // Enum for schedule type
    reference_id: string; // ID from Projects/Tasks/Activities
    start_date: Date;
    end_date: Date;
    orgId?: string;
}

@Table({ tableName: "master_schedule" })
class MasterSchedule extends Model<IMasterSchedule> implements IMasterSchedule {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    schedule_type!: "Project" | "Task" | "Activity"; // Enum for schedule type

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    reference_id!: string; // ID from Projects/Tasks/Activities

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    start_date!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    end_date!: Date;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default MasterSchedule;
