module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hashed: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return User;
};