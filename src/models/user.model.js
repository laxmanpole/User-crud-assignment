const { STATUS } = require('../consts');

module.exports = (sequelize, Sequelize) => sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING(255),
    defaultValue: null,
    allowNull: true,
  },
  last_name: {
    type: Sequelize.STRING(255),
    defaultValue: null,
    allowNull: true,
  },
  phone_no: {
    type: Sequelize.STRING(32),
    defaultValue: null,
    allowNull: true,
  },
  status: {
    type: Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: STATUS.ENABLED,
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
