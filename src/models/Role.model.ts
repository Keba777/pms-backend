import {
  Model,
  Table,
  Column,
  PrimaryKey,
  Default,
  DataType,
} from "sequelize-typescript";

export type PermissionActions = "create" | "update" | "delete" | "manage";

export interface IPermissions {
  [resource: string]: Partial<Record<PermissionActions, boolean>> | null;
}

export interface IRole {
  id?: string;
  name: string;
  permissions?: IPermissions | null;
}

@Table({
  tableName: "roles",
  timestamps: true,
})
class Role extends Model<IRole> implements IRole {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: null,
  })
  permissions?: IPermissions | null;
}

export default Role;
