const comment = require('../model/Comment');
const user = require('../model/User');
const post = require('../model/Post');

module.exports = {

    create: async (req,res) =>{

        const userId = req.userId;
        const postId = req.params.id_post;



        const verifyIdUser = await user.findByPk(userId);

        const verifyPost = await post.findByPk(postId);



        if(!verifyIdUser){return res.status(404).json('User not Exist');}

        if(!verifyPost){return res.status(404).json('Post not Exist');}

        await comment.create({
                content:req.body.content,

                //É necessário porque é preciso
                //saber que usuário está fazendo o
                // comentário
                userIdUser: verifyIdUser.id_user
            }).then(comments =>{

                //Adiciona a chave estrangeira na
                // tabela comment_post, pois é uma
                //relação Muitos-para-Muitos

                /*
                Add the foreign key on comment_post
                bacouse it is many to many relationship
                */

                comments.addPost(verifyPost);
                return  res.status(200).json(comments);

            })


        
                 


    },

    ListAllComment: async (req,res) =>{
        await comment.findAll({include:{association:'post'}}).then(comment =>{
            return res.status(200).json(comment);
        })
    },

    deleteComment: async (req,res) =>{
        const commentId = req.params.idComment;
        const userId = req.userId;

        if(!userId){return res.status(404).json("User not found")}

        if(!commentId){return res.status(404).send("Comment not found")}

        await comment.destroy({where:{id_comment:commentId}}).then(comments =>{
            return res.status(200).json(comments);
        })
    },

    commentUpdate: async (req,res) =>{
        const content = req.body.content;
        const idComment = req.params.idComment
        const userId = req.userId;


        if(!userId){return res.status(401).json("User not found")}

        if(!idComment){
            return res.status(404).json({msg:"Select a Comment"});
        }

        const verifyCommentById = await comment.findByPk(idComment);

        if(!verifyCommentById){return res.status(404).json({msg:'Comment not Exist'})}



        if(!content){
            return res.status(401).json({msg:"Content is required"});
        }

        await comment.update({content: content},{where:{id_comment: verifyCommentById.id_comment}}).then(() =>{
            return res.status(200).json({msg:"Comment Updated with successfully"});
        })
    },

    listCommentByPost: async (req,res) =>{
        const commentId = req.params.idComment;
        const postId = req.params.idPost;


        if(!postId){res.status(404).json('Post not Found')}


        if(!commentId){res.status(404).json('Comment not Found')}

        comment.findAll({include:[{
            model: post,
            as:'post',
            where:{id_post:postId}
        }]
    }).then(comment =>{
        return res.status(200).json(comment);
    })

        


    }


}