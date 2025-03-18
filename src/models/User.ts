import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
} from "sequelize-typescript";
import jwt from "jsonwebtoken";
import Role from "./Role";

// Define an interface for User attributes
interface IUser {
    id?: string;
    first_name: string;
    last_name: string;
    phone: string;
    role_id: string;
    email: string;
    password: string;
    profile_picture?: string;
    country_code: string;
    country: string;
    state: string;
    city: string;
    zip: string;
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

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    first_name!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    last_name!: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    phone!: string;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    role_id!: string;

    @Column({
        type: DataType.STRING(100),
        unique: true,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    profile_picture?: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    country_code!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    country!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    state!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    zip!: string;

    // Instance method to sign JWT and return
    getSignedJwtToken() {
        return jwt.sign(
            { id: this.id },
            process.env.JWT_SECRET || "this is the secret",
            {
                expiresIn: process.env.JWT_EXPIRE ? parseInt(process.env.JWT_EXPIRE) : "30d",
            }
        );
    }
}

export default User;
export { IUser };
