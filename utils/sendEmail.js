const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, from, subject, text) => {
  const message = {
    to,
    from,
    subject,
    text,
  };

  sgMail.send(message);
};

// <=== Use the text field for password reset messages
// html: msg, This is not encoded and only sends html. Remember to use the text variable which will give a link that enconded and that is sent from sendgrid.
module.exports = sendEmail;
