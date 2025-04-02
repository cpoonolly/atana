import { DataTypes } from 'sequelize';

import { sequelize } from './connection.mjs';

export const Tag = sequelize.define(
    'Tag',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
      sequelize,
    },
);