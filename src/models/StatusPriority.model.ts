// StatusPriority.model.ts
import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";
@Table({ tableName: "status_priority" })
class StatusPriority extends Model {
    @PrimaryKey
    @Column(DataType.STRING(20))
    code!: string;

    @Column(DataType.STRING(50))
    name!: string;

    @Column(DataType.STRING(7))
    color_code!: string;
}

export default StatusPriority;