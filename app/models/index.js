const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

// Corrected Association between User and Role
db.user.belongsToMany(db.role, {
    through: "user_roles",
    as: "roles",          // Alias for retrieving roles from User
    foreignKey: "userId"
});

db.role.belongsToMany(db.user, {
    through: "user_roles",
    as: "users",          // Alias for retrieving users from Role
    foreignKey: "roleId"
});

// Self-association on the role model
db.role.belongsToMany(db.role, {
    through: "role_hierarchy", // or any table name you choose for the self-association
    as: "parentRoles",        // Alias for one side of the association
    foreignKey: "childRoleId",
    otherKey: "parentRoleId"
});

db.role.belongsToMany(db.role, {
    through: "role_hierarchy",
    as: "childRoles",         // Alias for the other side of the association
    foreignKey: "parentRoleId",
    otherKey: "childRoleId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
