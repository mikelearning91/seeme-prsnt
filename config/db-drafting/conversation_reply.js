module.exports = function(sequelize, Sequelize) {
    var conReply = sequelize.define('conversation_reply', {

        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },

        reply: { type: Sequelize.TEXT, allowNull: false },

        from_id: { type: Sequelize.INTEGER, allowNull: false },

        to_id: { type: Sequelize.INTEGER, allowNull: false },

        timestamp: { type: Sequelize.STRING, allowNull: false },

        con_id: { type: Sequelize.INTEGER, allowNull: false }
    });
    return conReply;
};