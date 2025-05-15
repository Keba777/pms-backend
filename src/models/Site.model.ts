import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany,
} from "sequelize-typescript";
import Project from "./Project.model";
import Warehouse from "./Warehouse.model";
import Equipment from "./Equipment.model";
import Labor from "./Labor.model";

export interface ISite {
    id: string;
    name: string;
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

    @HasMany(() => Project, { foreignKey: 'site_id' })
    projects?: Project[];

    @HasMany(() => Warehouse)
    warehouses!: Warehouse[];

    @HasMany(() => Equipment)
    equipments!: Equipment[];

    @HasMany(() => Labor)
    labors!: Labor[];
}

export default Site;
