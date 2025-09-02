import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
} from "sequelize-typescript";
import User from "./User.model";

interface IFile {
    date: Date;
    title: string;
    uploadedBy: string;
    sendTo: string;
    fileName: string; // original file name
    fileUrl: string;  // Cloudinary URL
    type: "project" | "task" | "activity" | "todo";
    referenceId: string; // the id of the related table entry
}

@Table({ tableName: "files", timestamps: true })
class File extends Model<IFile> implements IFile {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, allowNull: false })
    date!: Date;

    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    uploadedBy!: string;

    @BelongsTo(() => User, { foreignKey: "uploadedBy", as: "uploadedByUser" })
    uploadedByUser?: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    sendTo!: string;

    @BelongsTo(() => User, { foreignKey: "sendTo", as: "sendToUser" })
    sendToUser?: User;

    @Column({ type: DataType.STRING, allowNull: false })
    fileName!: string; // original file name

    @Column({ type: DataType.STRING, allowNull: false })
    fileUrl!: string; // Cloudinary URL

    @Column({
        type: DataType.ENUM("project", "task", "activity", "todo"),
        allowNull: false,
    })
    type!: "project" | "task" | "activity" | "todo";

    @Column({ type: DataType.UUID, allowNull: false })
    referenceId!: string; // The id of the related table entry
}

export default File;
