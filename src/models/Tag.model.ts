import { Model, Table, Column, PrimaryKey, Default, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Organization from "./Organization.model";

interface ITag {
  id?: string;
  name: string;
  orgId?: string;
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

  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID })
  orgId!: string;

  @BelongsTo(() => Organization)
  organization!: Organization;
}

export default Tag;
