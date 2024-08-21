const { User, Log_changed_password } = require("../../models");
const ApiError = require("../../helpers/errorHandler");
const { getHash, checkHash } = require("../../helpers/passwordHash");
const Validator = require("fastest-validator");
const v = new Validator();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

const checkDuplicate = async (email) => {
  const result = await User.findOne({
    where: { email },
  });

  if (result) {
    throw ApiError.badRequest("Email already used!");
  }

  return result;
};

const create = async (req) => {
  const { email, password } = req.body;

  await checkDuplicate(email);

  const schemaEmail = {
    email: { type: "email", label: "Email Address" },
  };

  const schemaPassword = {
    password: { type: "string", min: 6 },
  };

  const checkEmail = await v.compile(schemaEmail);
  const checkPassword = await v.compile(schemaPassword);

  const validateEmail = checkEmail({
    email: `${email}`,
  });

  const validatePassword = checkPassword({
    password: `${password}`,
  });

  // Email Validation
  if (validateEmail.length > 0) {
    throw ApiError.badRequest("Email tidak valid");
  }

  // Password Validation
  if (validatePassword.length > 0) {
    throw ApiError.badRequest("Password minimal 6 karakter");
  }

  const passwordHashed = getHash(password);
  req.body.password = passwordHashed;

  const result = await User.create(req.body);

  await Log_changed_password.create({
    user_id: result.id,
    password: passwordHashed,
  });

  const resultWithoutPassword = { ...result.toJSON(), password: undefined };

  return resultWithoutPassword;
};

const login = async (req) => {
  const { email, password } = req.body;

  if (!email) {
    throw ApiError.badRequest("Email harus diisi");
  }

  const schemaPassword = {
    password: { type: "string", min: 6 },
  };

  const checkPassword = await v.compile(schemaPassword);

  const validatePassword = checkPassword({
    password: `${password}`,
  });

  // Password Validation
  if (validatePassword.length > 0) {
    throw ApiError.badRequest("Password minimal 6 karakter");
  }

  let userExist = await User.findOne({ where: { email } });

  if (!userExist) {
    throw ApiError.badRequest("Email tidak ditemukan");
  }

  const match = checkHash(password, userExist.password);
  if (!match) {
    throw ApiError.badRequest("Password/Email salah");
  }

  let payload = {
    id: userExist.id,
    email: userExist.email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY);

  return { token };
};

const changePassword = async (req) => {
  const { oldPassword, newPassword } = req.body;

  const user = req.user;
  const userId = user.id;

  const userExist = await User.findOne({ where: { id: userId } });

  if (!userExist) {
    throw ApiError.badRequest("User tidak ditemukan");
  }

  const match = checkHash(oldPassword, user.password);

  if (!match) {
    throw ApiError.badRequest("Password lama salah");
  }

  const passwordHashed = getHash(newPassword);

  const result = await User.update(
    { password: passwordHashed },
    { where: { id: userId } }
  );

  await Log_changed_password.create({
    user_id: userId,
    password: passwordHashed,
  });

  return result;
};

module.exports = {
  create,
  login,
  changePassword,
};
