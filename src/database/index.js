const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config/db-config');

// Tables
const defineUserModel = require('../models/user');
const defineUserRoleModel = require('../models/user_role');
const defineRefreshTokenModel = require('../models/refresh_token');
const defineContainerTypeModel = require('../models/container_type');
const defineContainerModel = require('../models/container');
const defineContainerBindingModel = require('../models/container_binding');
const defineMessageModel = require('../models/message');

const sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT,
});

const db = {};

db.User = defineUserModel(sequelize, DataTypes);
db.UserRole = defineUserRoleModel(sequelize, DataTypes);
db.RefreshToken = defineRefreshTokenModel(sequelize, DataTypes);
db.ContainerType = defineContainerTypeModel(sequelize, DataTypes);
db.Container = defineContainerModel(sequelize, DataTypes);
db.ContainerBinding = defineContainerBindingModel(sequelize, DataTypes);
db.Message = defineMessageModel(sequelize, DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;