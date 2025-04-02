import { Sequelize, DataTypes } from 'sequelize';

import { sequelize } from './connection.mjs';
import { Tag } from './tags.mjs';

export const Course = sequelize.define(
    'Course',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        courseId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: DataTypes.STRING,
        created: DataTypes.DATE,
        updated: DataTypes.DATE,
        version: DataTypes.INTEGER,
        activityId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseLearningStandard: DataTypes.STRING,
        raw: DataTypes.JSON
    },
    {
      sequelize,
    },
);

Tag.belongsToMany(Course, { through: 'CourseTags' })