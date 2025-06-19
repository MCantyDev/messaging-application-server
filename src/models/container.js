module.exports = (sequelize, DataTypes) => {
    const container = sequelize.define('Container', {
        type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'container_types',
                key: 'id',
            },
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: 'containers',
    });

    return container;
}