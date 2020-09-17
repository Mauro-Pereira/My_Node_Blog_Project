const db = require('../../BD/bd_config');
const bcrypt = require('bcryptjs');



const User = db.sequelize.define('user',{
 
    id_user:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
             beforeCreate: (user) => {
               const salt = bcrypt.genSaltSync();
               user.password = bcrypt.hashSync(user.password, salt);
        }
    },      
        
});



module.exports = User;