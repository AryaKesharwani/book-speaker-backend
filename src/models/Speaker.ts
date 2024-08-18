import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SpeakerAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  expertise: string[];
  pricePerSession: number;
}

interface SpeakerCreationAttributes extends Optional<SpeakerAttributes, 'id'> {}

class Speaker extends Model<SpeakerAttributes, SpeakerCreationAttributes> implements SpeakerAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public expertise!: string[];
  public pricePerSession!: number;
}

Speaker.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expertise: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    pricePerSession: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Speaker',
  }
);

export default Speaker;