module.exports = (sequelize, DataTypes) => {
    const containerTypes = sequelize.define('ContainerType', {
        container_type: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
    },
    { 
        timestamps: false,
        tableName: 'container_types',
    });

    return containerTypes;
};