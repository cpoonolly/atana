import { DataTypes } from 'sequelize';
import { sequelize } from './connection.mjs';

export const Learner = sequelize.define(
    'Learner',
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        learnerId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
    },
    {
      sequelize,
    },
);