module.exports = function(sequelize, DataTypes) {
    var Matches = sequelize.define("Matches", {
        row_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        WLID: {
            type: DataTypes.STRING
        },
        GLID: {
            type: DataTypes.STRING
        },
        mutual: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }

    });
    return Matches;
};