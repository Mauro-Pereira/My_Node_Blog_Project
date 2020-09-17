const db = require('../../BD/bd_config');
const user = require('../model/User');
const post = require('../model/Post');

const Comment = db.sequelize.define('comment',{
    
    id_comment:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    content:{
        type:db.Sequelize.TEXT,
        allowNull: true
    }
})


user.hasMany(Comment);
Comment.belongsTo(user);



Comment.belongsToMany(post,{through:'comment_post', as:'post', onDelete:'CASCADE',hooks:true});
post.belongsToMany(Comment,{through:'comment_post',as:'comment', onDelete:'CASCADE',hooks:true});

module.exports = Comment;