const nodemailer = require("nodemailer");
const models = require("../models");
const moment = require("moment");
const mailerConf = {
  from: process.env.MAILER_FROM,
  user: process.env.MAILER_USER,
  pass: process.env.MAILER_PASS,
};
const { INSERT_EMAIL_AUTH } = require("./queries");

const makeUUID = () => {
  return (
    new moment().format("YYYYMMDDHHmmss") + Math.random().toString(36).slice(2)
  );
};

// mail: {to, subject, text, html}
const sendMail = (mail) =>
  new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: mailerConf.user,
        pass: mailerConf.pass,
      },
    });
    await transporter
      .sendMail({
        from: mailerConf.from,
        ...mail,
      })
      .then((messageId) => resolve(messageId))
      .catch(() => reject(new Error("Fail to send mail")));
  });

const sendMailOfSignupAuth = (email_address) =>
  new Promise(async (resolve, reject) => {
    const uuid = makeUUID();
    const exp_date = new moment()
      .add(30, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    await models.sequelize
      .query(INSERT_EMAIL_AUTH, {
        replacements: {
          UUID: uuid,
          EMAIL: email_address,
          EXPIRE_DATE: exp_date,
        },
      })
      .spread(
        (results) => results[0],
        (error) => error
      );

    const mail = {
      to: email_address,
      subject: `[YOUR SYSTEM] Email Authentication`,
      text: `Email Authentication`,
      html: `
            <div style="color: black">
                <div
                    style="
                        font-size: 16px;
                        border-radius: 10px;
                        padding: 0;
                        list-style: none;
                        width: 600px;
                        margin: 20px auto;
                        border: 2px solid #ccc;
                    "
                >
                    <p style="font-size: 23px; text-align: center">YOUR NAME OF SYSTEM</p>
                    <p
                        style="
                            font-size: 25px;
                            font-weight: bold;
                            text-align: center;
                            background: #ddd;
                            padding: 15px;
                        "
                    >
                        EMAIL AUTHENTICATION
                    </p>
                    <p
                        style="
                            font-size: 20px;
                            font-weight: bold;
                            padding-left: 5px;
                            margin: 7px;
                            color: red;
                            margin-bottom: 30px;
                        "
                    >
                        Click the button below.
                    </p>
                    <a
                        style="
                            display: block;
                            width: 200px;
                            padding: 15px;
                            text-decoration: none;
                            font-size: 20px;
                            font-weight: bold;
                            background-color: grey;
                            color: white;
                            text-align: center;
                            margin: 0 auto;
                        "
                        href="${process.env.SERVER_ADDR}/api/auth/email-auth?uuid=${uuid}"
                        target="_blank"
                    >
                        IT'S ME, AUTHENTICATE
                    </a>
                    <div
                        style="
                            padding: 15px;
                            font-size: 17px;
                            text-align: center;
                            margin: 0 auto;
                            color: darkblue;
                        "
                    >
                        EXPIRED AT: ${exp_date}
                    </div>
                    <hr />
                    <p style="margin-top: 15px; text-align: center; font-size: 15px; color: #555">
                        This mail does not reply.
                    </p>
                </div>
            </div>
        `,
    };

    await sendMail(mail)
      .then(() => resolve(uuid))
      .catch(() => reject(new Error("Fail to send mail")));
  });

module.exports = {
  sendMailOfSignupAuth,
};
