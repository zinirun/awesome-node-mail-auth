const { Router } = require("express");
const router = Router();

router.use("/api/auth", require("./auth"));
module.exports = router;
