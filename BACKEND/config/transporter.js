const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sathiradissanayaka80@gmail.com', // Replace with your Gmail email address
    pass: 'cubn wpts hxzg hqis', // Replace with your Gmail password or app-specific password
  },
});

module.exports = transporter;
