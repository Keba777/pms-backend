// LaborRequest.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
@Table({ tableName: "labor_requests" })
class LaborRequest extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.STRING(100))
    labor_name!: string;

    @Column(DataType.STRING(50))
    position!: string;

    @Column(DataType.STRING(20))
    unit!: string;

    @Column(DataType.DECIMAL(5, 2))
    rate!: number;

    @Column(DataType.ENUM('Pending', 'Approved', 'Canceled'))
    status!: string;

    @Column(DataType.TEXT)
    remark!: string;
}

export default LaborRequest;