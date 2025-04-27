import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsToMany,
    HasMany,
    BelongsTo,
} from "sequelize-typescript";
import jwt from "jsonwebtoken";
import Role from "./Role.model";
import Department from "./Department.model";
import Project from "./Project.model";
import Task from "./Task.model";
import Activity from "./Activity.model";
import Request from "./Request.model";
import ProjectMember from "./ProjectMember.model";
import TaskMember from "./TaskMember.model";
import ActivityMember from "./ActivityMember.model";

export interface IUser {
    id?: string;
    first_name: string;
    last_name: string;
    phone: string;
    role_id: string;
    email: string;
    password: string;
    profile_picture?: string;
    department_id?: string;
    status?: "Active" | "InActive";
    projects?: Project[];
    tasks?: Task[];
    activities?: Activity[];
    requests?: Request[];
}

@Table({
    tableName: "users",
    timestamps: true,
})
class User extends Model<IUser> implements IUser {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    id!: string;

    @Column({ type: DataType.STRING(50), allowNull: false })
    first_name!: string;

    @Column({ type: DataType.STRING(50), allowNull: false })
    last_name!: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    phone!: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID, allowNull: false })
    role_id!: string;

    @BelongsTo(() => Role, "role_id")
    role!: Role;

    @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
    email!: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    password!: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    profile_picture?: string;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    })
    department_id?: string;

    @Column({
        type: DataType.ENUM("Active", "InActive"),
        allowNull: true,
        defaultValue: "Active",
    })
    status?: "Active" | "InActive";

    @BelongsToMany(() => Project, {
        through: () => ProjectMember,
        foreignKey: "user_id",
        otherKey: "project_id"
    })
    projects?: Project[];

    @BelongsToMany(() => Task, {
        through: () => TaskMember,
        foreignKey: "user_id",
        otherKey: "task_id",
    })
    tasks?: Task[];

    @BelongsToMany(() => Activity, {
        through: () => ActivityMember,
        foreignKey: "user_id",
        otherKey: "activity_id",
    })
    activities?: Activity[];

    @HasMany(() => Request, { as: "requests" })
    requests?: Request[];


    getSignedJwtToken() {
        return jwt.sign(
            { id: this.id },
            process.env.JWT_SECRET || "this is the secret",
            {
                expiresIn: process.env.JWT_EXPIRE
                    ? parseInt(process.env.JWT_EXPIRE)
                    : "1d",
            }
        );
    }
}

export default User;
