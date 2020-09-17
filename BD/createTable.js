
const db = require('./bd_config');
/*
Isso possibilita a criação das tabelas no Banco Dados
usando para isso os modelos abaixo.
*/
const user = require('../src/model/User')
const comment = require('../src/model/Comment')
const author = require('../src/model/Author')
const post = require('../src/model/Post')
//const comment_post = require('../src/model/comment_post');


 db.sequelize.sync({force: true}).then(() => {

            console.log("Criado com sucesso");
});
    
