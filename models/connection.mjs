import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('sqlite:.database');