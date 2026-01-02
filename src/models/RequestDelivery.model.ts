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
import Approval from "./Approval.model";
import Site from "./Site.model";
import Organization from "./Organization.model";


export interface IRequestDelivery {
    id: string;
    approvalId: string;
    approval?: Approval;
    refNumber?: string;
    recievedQuantity: number;
    deliveredBy: string;
    recievedBy: string;
    deliveryDate: Date;
    siteId: string;
    site?: Site;
    remarks?: string;
    status: 'Pending' | 'Delivered' | 'Cancelled';
    orgId?: string;
}

@Table({ tableName: 'request_deliveries', timestamps: true })
class RequestDelivery extends Model<IRequestDelivery> implements IRequestDelivery {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    id!: string;

    @ForeignKey(() => Approval)
    @Column({ type: DataType.UUID, allowNull: false })
    approvalId!: string;

    @BelongsTo(() => Approval, 'approvalId')
    approval?: Approval;

    @Column({ type: DataType.STRING, allowNull: true })
    refNumber?: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    recievedQuantity!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    deliveredBy!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    recievedBy!: string;

    @Column({ type: DataType.DATE, allowNull: false })
    deliveryDate!: Date;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;

    @BelongsTo(() => Site, 'siteId')
    site?: Site;

    @Column({ type: DataType.TEXT, allowNull: true })
    remarks?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    })
    status!: 'Pending' | 'Delivered' | 'Cancelled';

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default RequestDelivery;