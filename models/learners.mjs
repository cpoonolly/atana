import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from './connection.mjs';

export const Learner = sequelize.define(
    'Learner',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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