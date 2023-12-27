/* eslint-disable no-shadow */
const { error, success } = require('../utils');
const {
  getListValidation, getId, addUserValidation, updateUserValidation,
} = require('../validations');
const { userService } = require('../services');

const getListCount = async (req, res, next) => {
  const reqData = { ...req.query };
  if (reqData.ids) {
    reqData.ids = reqData.ids.split(';');
  }
  try {
    const {
      status,
      search,
      ids,
      first_name,
      last_name,
      email_id,
      phone_no,
    } = await getListValidation.validateAsync(reqData);

    const count = await userService.getListCount({
      status,
      search,
      ids,
      first_name,
      last_name,
      email_id,
      phone_no,
    });
    return success.handler({ count }, req, res, next);
  } catch (err) {
    return error.handler(err, req, res, next);
  }
};

const getList = async (req, res, next) => {
  const reqData = { ...req.query };
  if (reqData.ids) {
    reqData.ids = reqData.ids.split(';');
  }
  try {
    const {
      page_no,
      page_size,
      status,
      sort_by,
      sort_order,
      search,
      ids,
      first_name,
      last_name,
      email_id,
      phone_no,
    } = await getListValidation.validateAsync(reqData);

    const users = await userService.getList({
      page_no,
      page_size,
      status,
      sort_by,
      sort_order,
      search,
      ids,
      first_name,
      last_name,
      email_id,
      phone_no,
    });
    return success.handler({ users }, req, res, next);
  } catch (err) {
    return error.handler(err, req, res, next);
  }
};

const getOne = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const id = await getId.validateAsync(userId);
    const user = await userService.getOne({
      id,
    });
    return success.handler({ user }, req, res, next);
  } catch (err) {
    return error.handler(err, req, res, next);
  }
};

const addOne = async (req, res, next) => {
  const reqBody = req.body;
  try {
    const {
      first_name,
      last_name,
      email_id,
      phone_no,
    } = await addUserValidation.validateAsync(reqBody);

    const user = await userService.addOne({
      first_name,
      last_name,
      email_id,
      phone_no,
    });
    return success.handler({ user }, req, res, next);
  } catch (err) {
    switch (err.name) {
      case 'SequelizeUniqueConstraintError':
        err.custom_key = 'UserConflict';
        err.message = `User with email ${req.body.email_id} already exists`;
        break;
      default:
        break;
    }
    return error.handler(err, req, res, next);
  }
};

const updateOne = async (req, res, next) => {
  const { userId } = req.params;
  const enableFlag = req.query.enable;
  try {
    const id = await getId.validateAsync(userId);
    const {
      first_name,
      last_name,
      email_id,
      phone_no,
      enable,
    } = await updateUserValidation.validateAsync({ ...req.body, enable: enableFlag });

    if (enable === true) {
      const item = await userService.enableOne({
        id,
      });

      return success.handler({ user: item }, req, res, next);
    }

    if (enable === false) {
      const item = await userService.disableOne({
        id,
      });
      return success.handler({ user: item }, req, res, next);
    }

    let item = await userService.getOne({
      id,
    });

    item.first_name = first_name !== undefined ? first_name : item.first_name;
    item.last_name = last_name !== undefined ? last_name : item.last_name;
    item.email_id = email_id !== undefined ? email_id : item.email_id;
    item.phone_no = phone_no !== undefined ? phone_no : item.phone_no;

    item = await item.save();

    return success.handler({ user: item }, req, res, next);
  } catch (err) {
    switch (err.name) {
      case 'SequelizeUniqueConstraintError':
        err.custom_key = 'UserConflict';
        err.message = `User with email ${req.body.email_id} already exists`;
        break;
      default:
        break;
    }
    return error.handler(err, req, res, next);
  }
};

const deleteOne = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const id = await getId.validateAsync(userId);
    const user = await userService.deleteOne({
      id,
    });
    return success.handler({ user }, req, res, next);
  } catch (err) {
    return error.handler(err, req, res, next);
  }
};

module.exports = {
  getListCount,
  getList,
  getOne,
  addOne,
  updateOne,
  deleteOne,
};
