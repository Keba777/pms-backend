import { Model, Table, Column, PrimaryKey, Default, DataType } from "sequelize-typescript";

interface ITag {
  id?: string;
  name: string;
}

@Table({
  tableName: "tags",
  timestamps: true,
})
class Tag extends Model<ITag> implements ITag {
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

export default Tag;
