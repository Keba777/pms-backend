import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

export interface IMasterSchedule {
    id: string;
    schedule_type: "Project" | "Task" | "Activity"; // Enum for schedule type
    reference_id: string; // ID from Projects/Tasks/Activities
    start_date: Date;
    end_date: Date;
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
}

export default MasterSchedule;
