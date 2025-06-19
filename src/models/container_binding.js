module.exports = (sequelize, DataTypes) => {
    const containerBindings = sequelize.define('ContainerBinding', {
        container_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'containers',
                key: 'id',
            },
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user_roles',
                key: 'id',
            },
            allowNull: false,
        },
        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, { 
        timestamps: false,
        tableName: 'container_bindings',
    });

    return containerBindings;
};