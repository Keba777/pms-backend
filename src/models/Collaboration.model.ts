import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./User.model";

export type ResourceType = "project" | "task" | "activity" | "todo";

/**
 * Discussion model
 */
@Table({ tableName: "collab_discussions", timestamps: true })
export class Discussion extends Model<any, any> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: ResourceType;

  @Column({ type: DataType.UUID, allowNull: false })
  referenceId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  subject!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  body!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: string;

  @BelongsTo(() => User, { foreignKey: "createdBy", as: "createdByUser" })
  createdByUser?: User;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPrivate!: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  participants?: string[]; // array of user UUIDs

  @Column({ type: DataType.DATE, allowNull: true })
  lastMessageAt?: Date;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  pinned!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Notification model
 */
@Table({ tableName: "collab_notifications", timestamps: true })
export class Notification extends Model<any, any> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: ResourceType;

  @Column({ type: DataType.UUID, allowNull: false })
  referenceId!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title?: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  message!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  recipient!: string;

  @BelongsTo(() => User, { foreignKey: "recipient", as: "recipientUser" })
  recipientUser?: User;

  // optional sender (system notifications might be null)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  sender?: string;

  @BelongsTo(() => User, { foreignKey: "sender", as: "senderUser" })
  senderUser?: User;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  read!: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  meta?: object;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * ActivityLog model
 */
@Table({ tableName: "collab_activity_logs", timestamps: true })
export class ActivityLog extends Model<any, any> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: ResourceType;

  @Column({ type: DataType.UUID, allowNull: false })
  referenceId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  action!: string; // e.g. "created", "updated", "deleted"

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  actor?: string;

  @BelongsTo(() => User, { foreignKey: "actor", as: "actorUser" })
  actorUser?: User;

  @Column({ type: DataType.JSONB, allowNull: true })
  details?: object;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parentActivityId?: number;

  @BelongsTo(() => ActivityLog, { foreignKey: "parentActivityId", as: "parentActivity" })
  parentActivity?: ActivityLog;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default { Discussion, Notification, ActivityLog };
