import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
} from "sequelize-typescript";

export interface ILoginAttempt {
    id?: string;
    email: string;
    status: "SUCCESS" | "FAILED";
    ip_address?: string;
    user_agent?: string;
    createdAt?: Date;
}

@Table({
    tableName: "login_attempts",
    timestamps: true,
})
class LoginAttempt extends Model<ILoginAttempt> implements ILoginAttempt {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    status!: "SUCCESS" | "FAILED";

    @Column({ type: DataType.STRING, allowNull: true })
    ip_address?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    user_agent?: string;

    @Column(DataType.DATE)
    createdAt!: Date;

    @Column(DataType.DATE)
    updatedAt!: Date;
}

export default LoginAttempt;
