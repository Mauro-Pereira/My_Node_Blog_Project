//importando sequelize
const Sequelize = require('sequelize');

//configurando banco de dados 
const sequelize = new Sequelize('blog','root','',{
    host:'localhost',
    dialect:'mysql',
    logging:false,
    define:{

        timestamps:false

    }
})


//Força a criação do banco de dados juntamente com suas tabelas
/*
sequelize.sync({force: true}).then(() => {

    console.log("Criado com sucesso");
    
})

*/

module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
}