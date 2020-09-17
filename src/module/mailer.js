
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {host,port,user,pass} = require('../../Config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {user,pass},

  });

  transport.use('compile',hbs({

    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resouces/mail'),
    extName: '.html',
      
  }))

  module.exports = transport;

  