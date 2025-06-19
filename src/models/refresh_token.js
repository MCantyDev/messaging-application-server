module.exports = (sequelize, DataTypes) => {
    const refreshToken = sequelize.define('RefreshToken', {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        issued_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    },
    {
        timestamps: false,
        tableName: 'refresh_tokens',
    })

    return refreshToken;
}