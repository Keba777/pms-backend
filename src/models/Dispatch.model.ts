import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Site from "./Site.model";
import Approval from "./Approval.model";

export interface IDispatch {
    id: String;
    approvalId: String;
    approval?: Approval;
    refNumber?: string;
    totalTransportCost: number;
    estArrivalTime: Date;
    depatureSiteId: String;
    depatureSite?: Site;
    arrivalSiteId: String;
    arrivalSite?: Site;
    remarks?: string;
    dispatchedDate: Date;
    driverName?: string;
    vehicleNumber?: string;
    vehicleType?: string;
    dispatchedBy?: "Plane" | "Truck";
    status: "Pending" | "In Transit" | "Delivered" | "Cancelled";
}

@Table({ tableName: 'dispatches', timestamps: true })
class Dispatch extends Model<IDispatch> implements IDispatch {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @ForeignKey(() => Approval)
    @Column({ type: DataType.UUID, allowNull: false })
    approvalId!: string;

    @BelongsTo(() => Approval, 'approvalId')
    approval?: Approval;

    @Column({ type: DataType.STRING, allowNull: true })
    refNumber?: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    totalTransportCost!: number;

    @Column({ type: DataType.DATE, allowNull: false })
    estArrivalTime!: Date;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    depatureSiteId!: string;

    @BelongsTo(() => Site, 'depatureSiteId')
    depatureSite?: Site;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    arrivalSiteId!: string;

    @BelongsTo(() => Site, 'arrivalSiteId')
    arrivalSite?: Site;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;

    @Column({ type: DataType.DATE, allowNull: false })
    dispatchedDate!: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    driverName?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    vehicleNumber?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    vehicleType?: string;

    @Column({ type: DataType.ENUM("Plane", "Truck"), allowNull: true })
    dispatchedBy?: "Plane" | "Truck";

    @Column({ type: DataType.ENUM("Pending", "In Transit", "Delivered", "Cancelled"), allowNull: false, defaultValue: "Pending" })
    status!: "Pending" | "In Transit" | "Delivered" | "Cancelled";
}

export default Dispatch;