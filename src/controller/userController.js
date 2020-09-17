const user = require('../model/User');
const crypto = require('crypto');
const mailer = require('../module/mailer');
const generateToken = require('../../Config/tokenGenerate');
const {comparePassword,passwordEncripton} = require('../../Config/passwordEncryptation');



module.exports = {

     create: async (req,res) =>{
        const email = req.body.email;
        const password = req.body.password;

        if(!email && !password){

            return res.status(403).json({msg:'please enter an email and a password'});
        }

        const verifyUser = await user.findOne({where:{email:email}});

        if(verifyUser){
            return res.status(401).json({msg:'User already exists'});
        }

        user.create({email:email,password:password}).then(() =>{
            res.status(200).json({msg:'user successfully created'});
        })
    },

    listAllUser: async (req,res) =>{
        user.findAll().then(user =>{
            return res.status(200).json(user);
        })
    },

    SignIn: async (req,res) => {

                
     user.findOne({
            where:{
                email:req.body.email, 
            }
        }).then(user => {

            if(!user){
                res.status(404).json({msg:"User Not Found"});
            }

            const verifyComparePassword = comparePassword(req.body.password,user.password);
            

            if(!verifyComparePassword){
                res.status(401).json({msg:'Password not found'});
            }


        const id = user.id_user;

        res.send({user,token:generateToken({id:id})})
        
   })


},


deleteUser: async (req,res) =>{
    const userId = req.params.userId;
    if(!userId){return res.status(404).json("User doest exist")}
    user.destroy({where:{id_user:userId}}).then(comments =>{
        return res.status(200).json(comments);
    })
},

updateUser: async (req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const idUser = req.userId;


    if(!email){return res.status(404).json({msg:"Email is required"})}

    if(!password){return res.status(404).json({msg:"Password can´t to be void"})}

    const verifyEmail = await user.findOne({where:{email:email}});

    if(verifyEmail){return res.status(404).json({msg:"Email alrady Exists"})}

    const verifyUserById = await user.findByPk(idUser);

    if(verifyUserById){

                
             user.update({password:password,email:email},{where:{id_user:verifyUserById.id_user}}).then(() => {
                return res.status(200).json("Updated with successfully");
            
            })


        }


    },

    forgot_password: async(req,res) =>{

        const {email} = req.body;

        try{

            const verifyUserByEmail = await user.findOne({where:{email}});

            if(!verifyUserByEmail) return res.status(404).json({erro:'Email not found'});

            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);


             await user.update({passwordResetToken:token,passwordResetExpire:now},{where:{
                id_user:verifyUserByEmail.id_user
            }});


            
            mailer.sendMail({
                to:email,
                from:'my_blog@gmail.com',
               //tamplate:'../resources/mail/auth/forgotPassword',
                html:'<p>Você esqueceu sua senha? Use este token para alterar:  </p>' + token,
               //context: {token}

            },(err) =>{
                if(err) return res.json({erro:'Cannot send forgot password email'});

                res.send();
            })

        } catch(erro){
            res.json({error:'Erro in forgot password, try again'});
        }



    },

    resetPassword: async(req,res) =>{

        const {password,token} = req.body;

        try{

        const verifyUser = await user.findOne({where:{passwordResetToken:token}});

        if(!verifyUser)
        return res.status(404).json({msg:"User not found"});

        if(token !== verifyUser.passwordResetToken)
        return res.status(401).json({msg:"Error invalid token"});

        const now = new Date();

        if(now > verifyUser.passwordResetExpire)
        return res.status(401).json({msg:"Token expired, generate a new one"});

        const newPassword = passwordEncripton(password);


        const verifyUpdate = await user.update({password:newPassword},{where:{id_user:verifyUser.id_user}});
        if(verifyUpdate)
        return res.status(200).json(verifyUpdate);



        } catch(error){
            res.json(error);
        }


    }

}
