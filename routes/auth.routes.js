const router = require("express").Router();
const auth = require("../controllers/auth");
const isAuthenticate = require("../middlewares/authentication");

router.post("/signup", auth.registerUser);
router.post("/login", auth.loginUser);

router.use(isAuthenticate);
router.patch("/changePassword", auth.changePasswordUser);

module.exports = router;
