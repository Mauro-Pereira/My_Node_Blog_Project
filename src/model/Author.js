const db = require('../../BD/bd_config');
const bcrypt = require('bcryptjs');


const Author = db.sequelize.define('author',{
    
    id_author:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type:db.Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:db.Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:db.Sequelize.STRING,
        allowNull:false
    },
    passwordResetToken:{
      type:db.Sequelize.STRING,
      allowNull:true
    },
    passwordResetExpire:{
      type:db.Sequelize.DATE,
      allowNull:true
    }
}, {
     hooks: {
          beforeCreate: (author) => {
            const salt = bcrypt.genSaltSync();
            author.password = bcrypt.hashSync(author.password, salt);
          }
        },
        /*
        instanceMethods: {
          validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
          }

     }*/



     
        
});





module.exports = Author;