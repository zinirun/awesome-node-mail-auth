const { Router } = require("express");
const router = Router();

const ctrl = require("./auth.ctrl");

// SEND EMAIL
router.post("/email-send", ctrl.post_send_email);
// UPDATE AUTH CONFIRM
router.get("/email-auth", ctrl.get_auth_email);
// FINALLY CHECK CONFIRM
router.post("/email-check", ctrl.post_check_auth_email);

module.exports = router;
