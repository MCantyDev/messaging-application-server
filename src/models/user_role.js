module.exports = (sequelize, DataTypes) => {
    const userRoles = sequelize.define('UserRole', {
        role_name : {
            type : DataTypes.STRING(30),
            allowNull: false
        },
    }, 
    { 
        timestamps: false,
        tableName: 'user_roles',
    });

    return userRoles;
};