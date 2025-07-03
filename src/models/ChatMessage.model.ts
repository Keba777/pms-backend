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
import User from "./User.model";

export interface IChatMessage {
    id?: string;
    fromUserId: string;
    toUserId: string;
    content: string;
    read: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({ tableName: "chat_messages", timestamps: true })
class ChatMessage extends Model<IChatMessage> implements IChatMessage {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    fromUserId!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    toUserId!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content!: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    read!: boolean;

    @BelongsTo(() => User, 'fromUserId')
    fromUser?: User;

    @BelongsTo(() => User, 'toUserId')
    toUser?: User;
}

export default ChatMessage;
