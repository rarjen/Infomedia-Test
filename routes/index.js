const router = require("express").Router();
const responseHandler = require("../helpers/responseHandler");
const auth = require("./auth.routes");

router.get("/test", (req, res) => {
  return responseHandler.succes(res, "Test Route");
});

router.use("/auth", auth);

module.exports = router;
