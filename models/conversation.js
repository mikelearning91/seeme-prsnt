module.exports = function(sequelize, Sequelize) {
    var Con = sequelize.define('conversation', {

        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

        from_id: { type: Sequelize.STRING, allowNull: false },

        to_id: { type: Sequelize.STRING, allowNull: false },

        timestamp: { type: Sequelize.STRING, allowNull: false },

        con_id: { type: Sequelize.INTEGER, allowNull: false }
    });
    return Con;
};