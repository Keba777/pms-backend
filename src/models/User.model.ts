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
    BeforeUpdate,
    BeforeCreate,
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
import bcrypt from "bcryptjs";
import Site from "./Site.model";

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
    siteId: string;
    site?: Site
    responsiblities?: string[]
    status?: "Active" | "InActive";
    projects?: Project[];
    tasks?: Task[];
    activities?: Activity[];
    requests?: Request[];
    access?: "Low Access" | "Full Access" | "Average Access";
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

    @BelongsTo(() => Department, "department_id")
    department?: Department;

    @ForeignKey(() => Site)
    @Column({ type: DataType.UUID, allowNull: false })
    siteId!: string;
    @BelongsTo(() => Site)
    site!: Site;

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
    responsiblities?: string[];

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

    @Column({
        type: DataType.ENUM("Average", "Full Access", "Average Access"),
        allowNull: true,
        defaultValue: "Average",
    })
    access?: "Low Access" | "Full Access" | "Average Access";

    // Hash password before creating or updating when changed
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: User) {
        if (instance.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, salt);
        }
    }


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
