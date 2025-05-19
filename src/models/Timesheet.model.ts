import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    Default,
} from "sequelize-typescript";
import User from "./User.model";
import Equipment from "./Equipment.model";
import Material from "./Material.model";

// Interface for Labor Timesheet entries
enum TimeSheetStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
}

export interface ILaborTimesheet {
    id: string;
    userId: string;
    date: Date;
    morningIn: string;
    morningOut: string;
    mornHrs: number;
    bt: number;
    afternoonIn: string;
    afternoonOut: string;
    aftHrs: number;
    ot: number;
    dt: number;
    rate: number;
    totalPay: number;
    status: TimeSheetStatus;
}

@Table({ tableName: "labor_timesheets", timestamps: true })
export class LaborTimesheet extends Model<ILaborTimesheet> implements ILaborTimesheet {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    id!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @BelongsTo(() => User)
    user!: User;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    date!: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    morningIn!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    morningOut!: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    mornHrs!: number;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    bt!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    afternoonIn!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    afternoonOut!: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    aftHrs!: number;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    ot!: number;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    dt!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    rate!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    totalPay!: number;

    @Column({ type: DataType.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" })
    status!: TimeSheetStatus;
}

// Equipment Timesheet entries
export interface IEquipmentTimesheet {
    id: string;
    equipmentId: string;
    date: Date;
    morningIn: string;
    morningOut: string;
    mornHrs: number;
    bt: number;
    afternoonIn: string;
    afternoonOut: string;
    aftHrs: number;
    ot: number;
    dt: number;
    rate: number;
    totalPay: number;
    status: TimeSheetStatus;
}

@Table({ tableName: "equipment_timesheets", timestamps: true })
export class EquipmentTimesheet extends Model<IEquipmentTimesheet> implements IEquipmentTimesheet {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    id!: string;

    @ForeignKey(() => Equipment)
    @Column({ type: DataType.UUID, allowNull: false })
    equipmentId!: string;

    @BelongsTo(() => Equipment)
    equipment!: Equipment;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    date!: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    morningIn!: string;
    @Column({ type: DataType.STRING, allowNull: false })
    morningOut!: string;
    @Column({ type: DataType.FLOAT, allowNull: false })
    mornHrs!: number;
    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    bt!: number;
    @Column({ type: DataType.STRING, allowNull: false })
    afternoonIn!: string;
    @Column({ type: DataType.STRING, allowNull: false })
    afternoonOut!: string;
    @Column({ type: DataType.FLOAT, allowNull: false })
    aftHrs!: number;
    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    ot!: number;
    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    dt!: number;
    @Column({ type: DataType.FLOAT, allowNull: false })
    rate!: number;
    @Column({ type: DataType.FLOAT, allowNull: false })
    totalPay!: number;
    @Column({ type: DataType.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" })
    status!: TimeSheetStatus;
}

// Material Balance Sheet entries
export interface IMaterialBalanceSheet {
    id: string;
    materialId: string;
    date: Date;
    receivedQty: number;
    utilizedQty: number;
    balance: number;
    assignedTo: string;
    remark?: string;
    status: string;
}

@Table({ tableName: "material_balance_timesheets", timestamps: true })
export class MaterialBalanceSheet extends Model<IMaterialBalanceSheet> implements IMaterialBalanceSheet {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    id!: string;

    @ForeignKey(() => Material)
    @Column({ type: DataType.UUID, allowNull: false })
    materialId!: string;

    @BelongsTo(() => Material)
    material!: Material;

    @Column({ type: DataType.DATEONLY, allowNull: false })
    date!: Date;

    @Column({ type: DataType.INTEGER, allowNull: false })
    receivedQty!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    utilizedQty!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    balance!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    assignedTo!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    remark?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    status!: string;
}
