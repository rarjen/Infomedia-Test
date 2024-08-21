"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log_changed_password extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log_changed_password.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    }
  }
  Log_changed_password.init(
    {
      user_id: DataTypes.INTEGER,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Log_changed_password",
    }
  );
  return Log_changed_password;
};
