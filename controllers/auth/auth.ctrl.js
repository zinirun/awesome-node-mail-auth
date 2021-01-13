const { sendMailOfSignupAuth } = require("../../api/mailer");
const {
  SELECT_USER_ID_EXISTS,
  UPDATE_EMAIL_AUTH,
  SELECT_EMAIL_AUTH_CONFM,
} = require("./queries");
const models = require("../../models");

module.exports = {
  post_send_email: async (req, res) => {
    const { email_address } = req.body;

    const isValidUserId = await models.sequelize
      .query(SELECT_USER_ID_EXISTS, {
        replacements: {
          USER_ID: email_address,
        },
      })
      .spread(
        (results) => {
          const user = JSON.parse(JSON.stringify(results));
          return user[0] ? false : true;
        },
        (error) => false
      );

    if (isValidUserId) {
      await sendMailOfSignupAuth(email_address)
        .then((uuid) => res.json({ success: true, uuid }))
        .catch(() => res.status(400).json({ mail: "fail" }));
    } else {
      return res.json({ success: false, message: "ID Exist" });
    }
  },

  get_auth_email: async (req, res) => {
    const { uuid } = req.query;
    const auth = await models.sequelize
      .query(UPDATE_EMAIL_AUTH, {
        replacements: {
          UUID: uuid,
        },
      })
      .spread(
        (results) => {
          const updated = JSON.parse(JSON.stringify(results));
          return updated.changedRows === 0 ? false : true;
        },
        (error) => false
      );
    return auth
      ? res.send(
          `<script type="text/javascript">self.opener=self;alert("Authenticated. Return to the page and complete your authentication.");window.close();</script>`
        )
      : res.send(
          `<script type="text/javascript">self.opener=self;alert("invalid authentication!");window.close();</script>`
        );
  },

  post_check_auth_email: async (req, res) => {
    const { uuid, email_address } = req.body;
    const checkAuth = await models.sequelize
      .query(SELECT_EMAIL_AUTH_CONFM, {
        replacements: {
          UUID: uuid,
          EMAIL: email_address,
        },
      })
      .spread(
        (results) => {
          const auth = JSON.parse(JSON.stringify(results));
          return auth[0] ? true : false;
        },
        (error) => false
      );
    return checkAuth
      ? res.json({ authed: true })
      : res.status(409).json({ authed: false });
  },
};
