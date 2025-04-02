import { DataTypes } from 'sequelize';

import { sequelize } from './connection.mjs';
import { Learner } from './learners.mjs';
import { Course } from './courses.mjs';
import { Tag } from './tags.mjs';

export const Registration = sequelize.define(
    'Registration',
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        registrationId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        instance: DataTypes.INTEGER,
        updated: DataTypes.DATE,
        registrationCompletion: DataTypes.STRING,
        registrationCompletionAmount: DataTypes.INTEGER,
        registrationSuccess: DataTypes.STRING,
        score: DataTypes.JSON,
        totalSecondsTracked: DataTypes.INTEGER,
        firstAccessDate: DataTypes.DATE,
        lastAccessDate: DataTypes.DATE,
        completedDate: DataTypes.DATE,
        createdDate: DataTypes.DATE,
        course: {
            type: DataTypes.UUID,
            references: {
                model: 'Courses',
                key: 'uuid'
            }
        },
        learner: {
            type: DataTypes.UUID,
            references: {
                model: 'Learners',
                key: 'uuid'
            }
        },
        raw: DataTypes.JSON
    },
    {
        sequelize,
    },
);


Learner.belongsToMany(Registration, { through: Registration });
Learner.hasMany(Registration);

Course.belongsToMany(Learner, { through: Registration });
Course.hasMany(Registration);

Registration.Learner = Registration.belongsTo(Learner);
Registration.Course = Registration.belongsTo(Course);

Tag.belongsToMany(Registration, { through: 'RegistrationTags' })