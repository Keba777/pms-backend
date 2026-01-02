import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Project from "./Project.model";
import Warehouse from "./Warehouse.model";
import Equipment from "./Equipment.model";
import Labor from "./Labor.model";
import User from "./User.model";
import Organization from "./Organization.model";

export interface ISite {
    id: string;
    name: string;
    orgId?: string;
    projects?: Project[];
}

@Table({ tableName: "sites", timestamps: true })
class Site extends Model<ISite> implements ISite {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column(DataType.STRING(100))
    name!: string;

    @HasMany(() => User, { foreignKey: 'siteId' })
    users?: User[];

    @HasMany(() => Project, { foreignKey: 'site_id' })
    projects?: Project[];

    @HasMany(() => Warehouse)
    warehouses!: Warehouse[];

    @HasMany(() => Equipment)
    equipments!: Equipment[];

    @HasMany(() => Labor)
    labors!: Labor[];

    @ForeignKey(() => Organization)
    @Column(DataType.UUID)
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Site;
