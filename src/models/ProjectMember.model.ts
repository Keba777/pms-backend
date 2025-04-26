import { Table, Model, Column, ForeignKey, DataType } from "sequelize-typescript";
import Project from "./Project.model";
import User from "./User.model";

@Table({
    tableName: "project_members",
    timestamps: false, // Disable automatic timestamps
})
export class ProjectMember extends Model {
    @ForeignKey(() => Project)
    @Column({ field: "project_id", type: DataType.UUID })
    projectId!: string;

    @ForeignKey(() => User)
    @Column({ field: "user_id", type: DataType.UUID })
    userId!: string;
}

export default ProjectMember;