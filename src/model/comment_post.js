const db = require('../../BD/bd_config');


const comment_post = db.sequelize.define('comment_post',{
    id_comment_post:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
    },
    commentIdComment:{
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    postIdPost:{
        type:db.Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = comment_post;