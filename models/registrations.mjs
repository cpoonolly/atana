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
        totalSecondsTracked: DataTypes.INTEGER,
        firstAccessDate: DataTypes.DATE,
        lastAccessDate: DataTypes.DATE,
        completedDate: DataTypes.DATE,
        createdDate: DataTypes.DATE,
        attempts: DataTypes.INTEGER,
        activityCompletion: DataTypes.STRING,
        activitySuccess: DataTypes.STRING,
        score: DataTypes.DOUBLE,
        completionAmount: DataTypes.DOUBLE,
        timeTracked: DataTypes.STRING,
        suspended: DataTypes.BOOLEAN,
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


Learner.hasMany(Registration);
Registration.belongsTo(Learner, {
    foreignKey: 'LearnerUuid'
});

Course.hasMany(Registration);
Registration.belongsTo(Course, {
    foreignKey: 'CourseUuid'
});

Tag.belongsToMany(Registration, { through: 'RegistrationTags' })