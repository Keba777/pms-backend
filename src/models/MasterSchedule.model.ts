// MasterSchedule.model.ts
import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";
@Table({ tableName: "master_schedule" })
class MasterSchedule extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(50))
    schedule_type!: string; // Project/Task/Activity

    @Column(DataType.UUID)
    reference_id!: string; // ID from Projects/Tasks/Activities

    @Column(DataType.DATE)
    start_date!: Date;

    @Column(DataType.DATE)
    end_date!: Date;
}

export default MasterSchedule;