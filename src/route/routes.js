const express = require('express');
const route = express.Router();
const db = require('../../BD/bd_config');

const userController = require('../controller/userController');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const authorController = require('../controller/authorController');

const path = require('path');



// importando multer
const multer = require('multer');
const verificaJWT = require('../../Config/verificaJWT');
// configurando local onde as imagens serão armazenados
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('./public/uploads'))
  },
  filename: function (req, file, cb) {

    var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1)

    cb(null, file.fieldname + '-' + Date.now() +'.'+ ext)
  }
})
var upload = multer({ 
 storage: storage, 
 limits: {fileSize: 1024 * 1024 * 5}

})


route.get('/',postController.listAllPost);
route.post('/v1/createPost',verificaJWT,upload.single('file'),postController.create);
route.post('/v1/createUser',userController.create);
route.get('/v1/listUser',verificaJWT,userController.listAllUser);
route.post('/v1/signInUser',userController.SignIn);
route.post('/v1/createComment/post/:id_post',verificaJWT,commentController.create);
route.get('/v1/listComment',commentController.ListAllComment);
route.post('/v1/createAuthor',authorController.create);
route.get('/v1/listAuthor',verificaJWT,authorController.listAllAuthor);
route.post('/v1/signInAuthor',authorController.SignIn);
route.delete('/v1/authorDelete',verificaJWT,authorController.deleteAuthor);
route.delete('/v1/postDelete/:id_post',verificaJWT,postController.deletePost);
route.delete('/v1/userDelete',verificaJWT,userController.deleteUser);
route.delete('/v1/commentDelete/:idComment',verificaJWT,commentController.deleteComment);
route.put('/v1/authorUpdates',verificaJWT, authorController.updatesAuthor);
route.put('/v1/postUpdates/:idPost',verificaJWT,postController.updatePost);
route.put('/v1/userUpdates',verificaJWT,userController.updateUser);
route.put('/v1/commentUpdates/:idComment',verificaJWT,commentController.commentUpdate);
route.post('/v1/forgotPasswordAuthor',authorController.forgot_password);
route.post('/v1/forgotPasswordUser',userController.forgot_password);
route.post('/v1/resetPasswordUser',userController.resetPassword);
route.post('/v1/resetPasswordAuthor', authorController.resetPassword);
route.get('/v1/listCommentByPost/post/:idPost/comment/:idComment',commentController.listCommentByPost);
route.get('/v1/listPostByName',postController.listPostByName);


module.exports = route;