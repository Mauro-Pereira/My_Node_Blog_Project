const author = require('../model/Author');
const crypto = require('crypto');
const mailer = require('../module/mailer');
const generateToken = require('../../Config/tokenGenerate');
const {comparePassword, passwordEncripton } = require('../../Config/passwordEncryptation');



module.exports = {

    create: async (req,res) =>{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(!name || !email || !password){
            return res.json('please enter a name, email and password');
        }

        const verifyAuthor = await author.findOne({where:{email:email}});

        if(verifyAuthor){
            return res.json('author already exist');
        }

        author.create({
            name:name,
            email:email,
            password:password
        }).then((author) =>{
            return res.json(author);
        }).catch(err =>{
            return res.json(err);
        })

    },

    listAllAuthor: async (req,res) =>{
        author.findAll().then(author =>{
            return res.status(200).json(author)
        })
    },

    
    SignIn: async (req,res) => {

        author.findOne({
            where:{
                email:req.body.email, 
            }
        }).then(author => {

            if(!author){
                res.status(404).json({msg:"Author not Exist"});
            }

            const verifyComparePassword = comparePassword(req.body.password,author.password);

            if(!verifyComparePassword){
                res.status(401).json({msg:'Password not found'});
            }

            

        const id = author.id_author

        res.send({author,token:generateToken({id:id})})
        
        })

    },

    
    deleteAuthor: async (req,res) =>{

        const authorId = req.userId;
        if(!authorId){return res.status(404).send("Author not found")}
        author.destroy({where:{id_author:authorId}}).then(() =>{
            return res.status(200).json('Author was deleted with succesfully');
        })
    },

    updatesAuthor: async (req,res) => {
        //declaração das variáveis principais
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        //pega o id passado pelo header da requisição, logo após o usuários se autenticar.
        // O id vem do token gerado na autenticação.
        const idAuthor = req.userId;
        //verifica se as variáveis não estão vazias, nulas ou "undefined"
        if(!name){
            return res.status(404).json({msg: "Name is Required"});
        } else if(!email){
            return res.status(404).json({msg:"Email is Required"});
        }else if(!password){
            return res.status(404).json({msg:"Password is Required"});
        }
        //verifica se o email atualizado já existe no banco de dados
        const verifyEmail = await author.findOne({where:{email:email}});
        //se já existe um autor com o mesmo email do emal atualizado, a atualização é cancelada
        //e uma mensagem é enviada para o cliente.
        if(verifyEmail){return res.status(404).json({msg:"Email already exists."})}
        //antes do autor atualizar seus dados, temos que saber se ele realmente existe no banco
        const verifyAuthorById = await author.findByPk(idAuthor);
        //se o autor existir, então a atualizão é feita.
        if(verifyAuthorById){
            //função resposável pela atualização.
        author.update({name:name,email:email,password:password},{where:{
                id_author:verifyAuthorById.id_author
            }}).then(() =>{
                return res.status(200).json("Author updated with sucessfully");
            })

        }else{
            res.status(404).json({msg:"Author not found"});
        }

    },

    forgot_password: async(req,res) =>{

        const {email} = req.body;

        try{

            const verifyAuthorByEmail = await author.findOne({where:{email}});

            if(!verifyAuthorByEmail) return res.status(404).json({erro:'Email not found'});

            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);


             await author.update({passwordResetToken:token,passwordResetExpire:now},{where:{
                id_author:verifyAuthorByEmail.id_author
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

        const verifyAuthor = await author.findOne({where:{passwordResetToken:token}});

        if(!verifyAuthor)
        return res.status(404).json({msg:"Author not found"});

        if(token !== verifyAuthor.passwordResetToken)
        return res.status(401).json({msg:"Error invalid token"});

        const now = new Date();

        if(now > verifyAuthor.passwordResetExpire)
        return res.status(401).json({msg:"Token expired, generate a new one"});

        const newPassword = passwordEncripton(password);

        const updateAuthor = await author.update({password:newPassword},{where:{id_author:verifyAuthor.id_author}});
         if(updateAuthor)
         return res.status(200).json(updateAuthor);



        } catch(error){
            res.json(error);
        }


    }
    

}