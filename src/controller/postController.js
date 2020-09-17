const post = require('../model/Post');
const author = require('../model/Author');
const comment = require('../model/Comment');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const fs = require('fs');



module.exports = {

    create: async (req,res) =>{

        const title = req.body.title;
        const date = Date.now();
        const content = req.body.content;
        const authorId = req.userId;
        const image = './public/uploads/';


        if(!title || !date || !content || !authorId){
            return res.json('please enter a title, date and content');
        }

        const verifyAuthor = await author.findOne({where:{id_author:authorId}});

        if(!verifyAuthor){
            return res.json('Author is required')
        }

        const verifyPost = await post.findOne({where:{title:title,date:date,content:content}});

        if(verifyPost){
            return res.json('Post already exist');
        }

        post.create({
            title:title,
            date: date,
            content:content,
            image:image + req.file.filename,
            authorIdAuthor: verifyAuthor.id_author
        }).then(post =>{

         
         res.status(200).json(post);

        });

    },

    listAllPost: async (req,res) =>{
         post.findAll({include:{association:'author'}}).then(post =>{
            return res.json(post);
        })

    },

    deletePost: async (req,res) =>{

        const postId = req.params.id_post;
        if(!postId){return res.status(404).json("Select a post")}

         post.findByPk(postId).then( async post =>{

            if(post === null){
                return res.status(404).json("Post not found");
            }
            
             fs.unlink(post.image,(error) => {
                 console.log(error)
             });
            

        const comments = await post.getComment();
        post.removeComment(comments);

          await post.destroy();

        return res.status(200).json("Post deleted with successfully");

            
        })

    },

    updatePost: async (req,res) =>{

        
        const title = req.body.title;
        const date = Date.now();
        const content = req.body.content;
        const idPost = req.params.idPost;

        

        if(!idPost){return res.json('Select a post')}

        const verifyPostById = await post.findByPk(idPost)

        if(!verifyPostById){return res.json('Post not Exist')}



        if(!title || !date || !content){
            return res.json('please enter a title, date and content');
        }

        const verifyPostByTitle = await post.findOne({where:{title:title}});

        if(verifyPostByTitle){return res.status(404).json({msg:"There is already a post with a title."})}

        post.update({title: title, date: date, content: content},{where:{id_post: verifyPostById.id_post}}).then(() => {

            return res.status(200).json({msg:"Updated with Successfully"})

        })

    },

    listPostByName: async(req,res) =>{
        const name = req.body.name;

        if(!name) return res.status(401).json({msg:"Enter with a name"});

        const verifyByName = await post.findOne({where:{title:{
            [Op.substring]:[name]
        }
    }});

    if(!verifyByName) return res.status(404).json("Post not Found");

    return res.status(200).json(verifyByName);

  }
}