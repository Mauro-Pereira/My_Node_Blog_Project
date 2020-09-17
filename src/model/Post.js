const db = require('../../BD/bd_config');
//const comment = require('../model/Comment');
const author = require('../model/Author');

const Post = db.sequelize.define('post',{
    
    id_post:{
        type:db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
    },
    title:{
        type:db.Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:db.Sequelize.DATE,
        allowNull:false
    },
    image:{

        type:db.Sequelize.TEXT,
        allowNull:false

    },
    content:{

        type: db.Sequelize.TEXT,
        allowNull:false

    },



})


author.hasMany(Post,{as:'Post'});
Post.belongsTo(author,{as:'author'});

//Post.belongsToMany(comment,{through:'comment_post'});
//comment.belongsToMany(Post,{through:'comment_post'});

module.exports = Post;
