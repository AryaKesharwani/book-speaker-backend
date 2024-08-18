import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Speaker from './Speaker';

interface SessionAttributes {
  id: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  userId: number;
  speakerId: number;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: number;
  public date!: Date;
  public startTime!: Date;
  public endTime!: Date;
  public userId!: number;
  public speakerId!: number;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speakerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Session',
  }
);

Session.belongsTo(User);
Session.belongsTo(Speaker);

export default Session;