const { Op } = require('sequelize');
const { error } = require('../utils');
const { STATUS } = require('../consts');
const { sequelizeManager } = require('../managers');

const { UserModel } = sequelizeManager;

const getListCount = async ({
  status, search, ids,
  first_name,
  last_name,
  email_id,
  phone_no,
}) => {
  const where = {
  };

  if (status) {
    where.status = status;
  }

  if (ids) {
    where.id = ids;
  }

  if (search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
    ];
  }

  if (first_name) {
    where.first_name = {
      [Op.like]: `%${first_name}%`,
    };
  }

  if (last_name) {
    where.last_name = {
      [Op.like]: `%${last_name}%`,
    };
  }

  if (email_id) {
    where.email_id = {
      [Op.like]: `%${email_id}%`,
    };
  }

  if (phone_no) {
    where.phone_no = {
      [Op.like]: `%${phone_no}%`,
    };
  }

  return UserModel.count({
    where,
  });
};

const getList = async ({
  page_no, page_size, status, sort_by, sort_order, search, ids, first_name,
  last_name,
  email_id,
  phone_no,
}) => {
  const limit = page_size;
  const offset = (page_no - 1) * limit;

  const where = {

  };

  if (ids) {
    where.id = ids;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
    ];
  }

  if (first_name) {
    where.first_name = {
      [Op.like]: `%${first_name}%`,
    };
  }

  if (last_name) {
    where.last_name = {
      [Op.like]: `%${last_name}%`,
    };
  }

  if (email_id) {
    where.email_id = {
      [Op.like]: `%${email_id}%`,
    };
  }

  if (phone_no) {
    where.phone_no = {
      [Op.like]: `%${phone_no}%`,
    };
  }

  const order = [];
  order.push([sort_by, sort_order]);

  return UserModel.findAll({
    where,
    order,
    offset,
    limit,
  });
};

const getOne = async ({ id }) => {
  const where = {
    id,
  };

  const item = await UserModel.findOne({
    where,
  });

  if (!item) {
    return error.throwNotFound({ custom_key: 'UserNotFound', item: 'User' });
  }

  return item;
};

const addOne = async ({
  first_name, last_name, email_id, phone_no,
}) => UserModel.create({
  first_name,
  last_name,
  email_id,
  phone_no,
});

const enableOne = async ({ id }) => {
  const item = await getOne({
    id,
  });

  if (item.status !== STATUS.DISABLED) {
    throw error.throwPreconditionFailed({ message: 'Only disabled user can be enabled' });
  }

  item.status = STATUS.ENABLED;
  return item.save();
};

const disableOne = async ({ id }) => {
  const item = await getOne({
    id,
  });

  if (item.status !== STATUS.ENABLED) {
    throw error.throwPreconditionFailed({ message: 'Only enabled user can be disabled' });
  }

  item.status = STATUS.DISABLED;
  return item.save();
};

const deleteOne = async ({ id }) => {
  const item = await getOne({
    id,
  });

  if (item.status === STATUS.ENABLED) {
    return error.throwPreconditionFailed({
      message: 'Enabled user can\'t be deleted',
    });
  }

  return item.destroy();
};

module.exports = {
  getListCount,
  getList,
  getOne,
  addOne,
  enableOne,
  disableOne,
  deleteOne,
};
