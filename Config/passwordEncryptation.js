const bcrypt = require('bcryptjs');

module.exports = {
    passwordEncripton: (password) =>{

        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(password, salt);
        return password

    },
    comparePassword: (password,hashPassword) =>{
    const comparedPassword = bcrypt.compareSync(password,hashPassword);
    return comparedPassword;

}

}

