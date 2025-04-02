import { DataTypes } from 'sequelize';

import { sequelize } from './connection.mjs';

export const Tag = sequelize.define(
    'Tag',
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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