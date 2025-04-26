import { Table, Model, Column, ForeignKey, DataType } from "sequelize-typescript";
import Activity from "./Activity.model";
import User from "./User.model";

@Table({
    tableName: "activity_members",
    timestamps: false, // Disable automatic timestamps
})
export class ActivityMember extends Model {
    @ForeignKey(() => Activity)
    @Column({ field: "activity_id", type: DataType.UUID })
    activityId!: string;

    @ForeignKey(() => User)
    @Column({ field: "user_id", type: DataType.UUID })
    userId!: string;
}
export default ActivityMember;