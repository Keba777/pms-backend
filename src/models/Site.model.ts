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
}

export default Site;
