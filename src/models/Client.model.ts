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

export interface IClient {
    id: string;
    companyName: string;
    responsiblePerson?: string;
    description?: string;
    attachments?: string[]; // JSONB array of strings (URLs or file references)
    status: "Active" | "Inactive";
    projects?: Project[];
}

@Table({ tableName: "clients", timestamps: true })
class Client extends Model<IClient> implements IClient {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    companyName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    responsiblePerson?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description?: string;

    @Default([])
    @Column({
        type: DataType.JSONB,
        allowNull: true
    })
    attachments?: string[];

    @Default("Active")
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status!: "Active" | "Inactive";

    @HasMany(() => Project)
    projects?: Project[];
}

export default Client;
