const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Replace with your OAuth2 credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER_EMAIL = process.env.USER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(name, email, message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `Your Website <${USER_EMAIL}>`,
      to: USER_EMAIL,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
}

exports.handler = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body);
    const result = await sendMail(name, email, message);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Email sent', result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'Failed to send email', error: error.message }),
    };
  }
};
