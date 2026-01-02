import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Default,
} from "sequelize-typescript";
import User, { IUser } from "./User.model";
import { Optional } from "sequelize";
import Organization from "./Organization.model";

export interface IChatRoomAttributes {
  id: string;
  name?: string;
  is_group: boolean;
  owner_id?: string;
  orgId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRoom extends Optional<IChatRoomAttributes, "id" | "createdAt" | "updatedAt"> {
  owner?: IUser;
  members?: IUser[];
  messages?: IChatMessage[];
}

@Table({
  tableName: "chat_rooms",
  timestamps: true,
})
class ChatRoom extends Model<IChatRoomAttributes, IChatRoom> implements IChatRoom {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true, // Required for groups, optional for individual chats
  })
  name?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_group!: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true, // Only set for groups
  })
  owner_id?: string;

  @BelongsTo(() => User, { foreignKey: "owner_id", as: "owner" })
  owner?: User;

  @BelongsToMany(() => User, {
    through: "chat_room_members",
    foreignKey: "room_id",
    otherKey: "user_id",
    as: "members",
  })
  members?: User[];

  @HasMany(() => ChatMessage, { foreignKey: "room_id", as: "messages" })
  messages?: ChatMessage[];

  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID })
  orgId!: string;

  @BelongsTo(() => Organization)
  organization!: Organization;
}

export interface IChatRoomMemberAttributes {
  room_id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRoomMember extends Optional<IChatRoomMemberAttributes, "createdAt" | "updatedAt"> {
  room?: IChatRoom;
  user?: IUser;
}

@Table({
  tableName: "chat_room_members",
  timestamps: true,
})
class ChatRoomMember extends Model<IChatRoomMemberAttributes, IChatRoomMember> implements IChatRoomMember {
  @ForeignKey(() => ChatRoom)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true, // Composite PK with user_id
  })
  room_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true, // Composite PK with room_id
  })
  user_id!: string;

  @BelongsTo(() => ChatRoom, { foreignKey: "room_id" })
  room!: ChatRoom;

  @BelongsTo(() => User, { foreignKey: "user_id" })
  user!: User;
}

export interface IChatMessageAttributes {
  id: string;
  room_id: string;
  sender_id: string;
  type: "text" | "voice" | "file";
  content?: string;
  media_url?: string;
  filename?: string;
  mime_type?: string;
  orgId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Optional<IChatMessageAttributes, "id" | "createdAt" | "updatedAt"> {
  room?: IChatRoom;
  sender?: IUser;
}

@Table({
  tableName: "chat_messages",
  timestamps: true,
})
class ChatMessage extends Model<IChatMessageAttributes, IChatMessage> implements IChatMessage {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => ChatRoom)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  room_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  sender_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "text",
  })
  type!: "text" | "voice" | "file";

  @Column({
    type: DataType.TEXT,
    allowNull: true, // Used for text content
  })
  content?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true, // Cloudinary URL for voice or file
  })
  media_url?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true, // Original filename for files
  })
  filename?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true, // MIME type for files/voice (e.g., 'audio/m4a', 'application/pdf')
  })
  mime_type?: string;

  @BelongsTo(() => ChatRoom, { foreignKey: "room_id", as: "room" })
  room!: ChatRoom;

  @BelongsTo(() => User, { foreignKey: "sender_id", as: "sender" })
  sender!: User;

  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID })
  orgId!: string;

  @BelongsTo(() => Organization)
  organization!: Organization;
}

export { ChatRoom, ChatRoomMember, ChatMessage };