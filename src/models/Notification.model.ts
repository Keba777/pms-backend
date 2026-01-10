import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, Default } from "sequelize-typescript";
import User from "./User.model";
import Organization from "./Organization.model";

// Use a strictly-typed payload instead of `any`
export type NotificationData = Record<string, unknown>;

export interface INotification {
    id?: string;
    type: string;          // e.g. 'task.assigned', 'profile.updated', etc.
    title?: string;        // Display title
    message?: string;      // Detailed message
    data?: NotificationData;
    read?: boolean;
    user_id: string;
    user?: User;
    orgId?: string;
    actionUrl?: string;    // URL to navigate when clicked
    actionLabel?: string;  // Label for action button
    icon?: string;         // Icon identifier
    priority?: string;     // Priority level: low, medium, high
}

@Table({ tableName: "notifications", timestamps: true })
class Notification extends Model<INotification> implements INotification {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    type!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    message?: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    data?: NotificationData;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    read!: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    actionUrl?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    actionLabel?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    icon?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    priority?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id!: string;

    @BelongsTo(() => User, "user_id")
    user!: User;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.UUID })
    orgId!: string;

    @BelongsTo(() => Organization)
    organization!: Organization;
}

export default Notification;
