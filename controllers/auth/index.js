const responseHandler = require("../../helpers/responseHandler");
const {
  create,
  login,
  changePassword,
} = require("../../services/auth/auth.service");

const registerUser = async (req, res, next) => {
  try {
    const result = await create(req);

    return responseHandler.created(res, "Success create!", result);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await login(req);

    return responseHandler.succes(res, "Success login!", result);
  } catch (error) {
    next(error);
  }
};

const changePasswordUser = async (req, res, next) => {
  try {
    const result = await changePassword(req);

    return responseHandler.succes(res, "Success update password!", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePasswordUser,
};
