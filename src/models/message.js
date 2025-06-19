module.exports = (sequelize, DataTypes) => {
    const messages = sequelize.define('Message', {
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: false,
        },
        container_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'containers',
                key: 'id',
            },
            allowNull: false,
        }
    },
    {
        tableName: 'messages',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return messages;
};