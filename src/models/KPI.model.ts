// KPI.model.ts
import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";
@Table({ tableName: "kpis" })
class KPI extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id!: string;

    @Column(DataType.ENUM('Labor', 'Machinery'))
    type!: string;

    @Column(DataType.INTEGER)
    score!: number;

    @Column(DataType.ENUM('Bad', 'Good', 'V.Good', 'Excellent'))
    status!: string;

    @Column(DataType.TEXT)
    remark!: string;
}

export default KPI;