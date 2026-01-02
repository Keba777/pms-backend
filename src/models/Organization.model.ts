import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany,
} from "sequelize-typescript";
import User from "./User.model";
import Project from "./Project.model";

export interface IOrganization {
    id: string;
    orgName: string;
    logo?: string | null;
    favicon?: string | null;
    primaryColor?: number | null;
    backgroundColor?: number | null;
    cardColor?: number | null;
    cardForegroundColor?: number | null;
    popoverColor?: number | null;
    popoverForegroundColor?: number | null;
    primaryForegroundColor?: number | null;
    secondaryColor?: number | null;
    secondaryForegroundColor?: number | null;
    mutedColor?: number | null;
    mutedForegroundColor?: number | null;
    accentColor?: number | null;
    accentForegroundColor?: number | null;
    destructiveColor?: number | null;
    destructiveForegroundColor?: number | null;
    borderColor?: number | null;
}

@Table({
    tableName: "organizations",
    timestamps: true,
})
class Organization extends Model<IOrganization> implements IOrganization {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    orgName!: string;

    @Column(DataType.TEXT)
    logo?: string | null;

    @Column(DataType.TEXT)
    favicon?: string | null;

    @Column(DataType.INTEGER)
    primaryColor?: number | null;

    @Column(DataType.INTEGER)
    backgroundColor?: number | null;

    @Column(DataType.INTEGER)
    cardColor?: number | null;

    @Column(DataType.INTEGER)
    cardForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    popoverColor?: number | null;

    @Column(DataType.INTEGER)
    popoverForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    primaryForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    secondaryColor?: number | null;

    @Column(DataType.INTEGER)
    secondaryForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    mutedColor?: number | null;

    @Column(DataType.INTEGER)
    mutedForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    accentColor?: number | null;

    @Column(DataType.INTEGER)
    accentForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    destructiveColor?: number | null;

    @Column(DataType.INTEGER)
    destructiveForegroundColor?: number | null;

    @Column(DataType.INTEGER)
    borderColor?: number | null;

    @HasMany(() => User)
    users!: User[];

    @HasMany(() => Project)
    projects!: Project[];
}

export default Organization;
