import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import Site from './Site.model';
import LaborInformation from './LaborInformation.model';
import Organization from './Organization.model';

export interface ILabor {
    id: string;
    role: string;
    siteId: string;
    site?: Site;
    unit: string;
    quantity?: number;
    minQuantity?: number;
    laborInformations?: LaborInformation[];
    status?: "Active" | "InActive";
    responsiblePerson?: string;
    orgId?: string;
}

@Table({ tableName: 'labors', timestamps: true })
class Labor extends Model<ILabor> implements ILabor {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: string;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;

    @BelongsTo(() => Site)
    site!: Site;

    @Column({ type: DataType.STRING, allowNull: false })
    unit!: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    quantity?: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    minQuantity?: number;

    @HasMany(() => LaborInformation)
    laborInformations!: LaborInformation[];

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "InActive",
    })
    status?: "Active" | "InActive";

    @Column({ type: DataType.STRING, allowNull: true })
    responsiblePerson?: string;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Labor;