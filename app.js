const express = require('express');
const cors = require('cors');

const app = express();
const port = normalizePort(process.env.PORT || '3000');
const bodyParse = require('body-parser');

const route = require('./src/route/routes')

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

app.use(cors());

function normalizePort(val){
    const port = parseInt(val,10);
    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}


app.use('/',route);
app.use('/v1/createPost',route);
app.use('/v1/createUser',route);
app.use('/v1/listUser',route);
app.use('/v1/signIn',route);
app.use('/v1/createComment/post/:id_post',route);
app.use('/v1/listComment',route);
app.use('/v1/createAuthor',route);
app.use('/v1/listAllAuthor',route);
app.use('/v1/signIn',route);
app.use('/v1/authorDelete',route);
app.use('/v1/postDelete/:id_post',route);
app.use('/v1/userDelete',route);
app.use('/v1/commentDelete',route);
app.use('/v1/authorUpdates', route);
app.use('/v1/postUpdates/:idPost',route);
app.use('/v1/userUpdates',route);
app.use('/v1/commentUpdates',route);
app.use('/v1/forgotPasswordAuthor',route);
app.use('/v1/forgotPasswordUser',route);
app.use('/v1/resetPasswordUser',route);
app.use('/v1/resetPasswordAuthor',route);
app.use('/v1/listCommentByPost/post/:idPost/comment/:idComment',route);
app.use('/v1/listPostByName',route);



app.listen(port, function(){
    console.log('app listening on port ' + port);
});