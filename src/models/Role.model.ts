import { Model, Table, Column, PrimaryKey, Default, DataType } from "sequelize-typescript";

interface IRole {
  id?: string;
  name: string;
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
}

export default Role;
