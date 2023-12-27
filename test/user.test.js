const { Op } = require('sequelize');
const { describe, it, after } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { sequelizeManager } = require('../src/managers');

const { UserModel } = sequelizeManager;

chai.use(chaiHttp);

// eslint-disable-next-line no-unused-vars
const should = chai.should();

const gt255 = `This website stores cookies on your computer. 
These cookies are used to collect information about how you interact with our website and 
allow us to remember you.We use this information in order to improve and customize your 
browsing experience and for analytics and metrics about our visitors both on this website and other media`;

const baseUrl = '/users';

/**
 * Bulk Create
 */

const createTestData = async () => UserModel.bulkCreate([{
  first_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  last_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
  phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
  status: 1,
}, {
  first_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  last_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
  phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
  status: 1,
},
{
  first_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  last_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
  phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
  status: 2,
}, {
  first_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  last_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
  phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
  status: 2,
}, {
  first_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  last_name: `test-${Math.floor(100000 + Math.random() * 900000)}`,
  email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
  phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
  deleted: 1,
  deleted_at: new Date(),
}]);

const createOne = async () => UserModel.create({
  name: 'test',
  status: 2,
});

const getOne = async ({ status }) => UserModel.findOne({
  where: {
    status,
  },
});

const getDeletedOne = async () => UserModel.findOne({
  where: {
    deleted_at: {
      [Op.ne]: null,
    },
  },
  paranoid: false,
});

const getLastRowId = async () => UserModel.max('id');

const getList = async ({ limit = 10 }) => UserModel.findAll({
  where: {
  },
  limit,
});

describe('users Test Suit', async () => {
  describe(`POST ${baseUrl}`, () => {
    it('should create bulk test data.', async () => {
      // eslint-disable-next-line no-unused-vars
      await createTestData();
    });

    it('should create a user. ', async () => {
      const body = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
        first_name: String(Math.floor(100000 + Math.random() * 900000)),
      };
      const res = await chai.request(app)
        .post(`${baseUrl}`)
        .send(body);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object');
    });

    it('should give validation error because name can not be blank.', async () => {
      const body = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
        first_name: '',
      };

      const res = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(body);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because name is not string.', async () => {
      const body = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
        first_name: 123,
      };

      const res = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(body);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because body contains a unknown field [xyz].', async () => {
      const body = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
        xyz: 123,
      };

      const res = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(body);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because name length is grater than 255 characters.', async () => {
      const body = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
        first_name: gt255,
      };

      const res = await chai
        .request(app)
        .post(`${baseUrl}`)
        .send(body);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });
  });

  describe(`PUT ${baseUrl}/:userId`, () => {
    const updatedName = String(Math.floor(100000 + Math.random() * 900000));
    const body = {
      first_name: updatedName,
    };
    it('should update a user of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}`)

        .send(body);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('first_name')
        .which
        .is
        .equal(String(updatedName));
    });

    it('should update a user name of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const tempBody = {
        first_name: String(Math.floor(100000 + Math.random() * 900000)),
      };
      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}`)

        .send(tempBody);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('first_name')
        .which
        .is
        .equal(tempBody.first_name);
    });

    it('should update a user last name of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const tempBody = {
        last_name: String(Math.floor(100000 + Math.random() * 900000)),
      };
      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}`)

        .send(tempBody);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('last_name')
        .which
        .is
        .equal(tempBody.last_name);
    });

    it('should update a user email of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const tempBody = {
        email_id: `test-${Math.floor(100000 + Math.random() * 900000)}@gmail.com`,
      };
      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}`)

        .send(tempBody);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('email_id')
        .which
        .is
        .equal(tempBody.email_id);
    });

    it('should update a user phone of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const tempBody = {
        phone_no: `${Math.floor(100000 + Math.random() * 900000)}`,
      };

      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}`)

        .send(tempBody);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('phone_no')
        .which
        .is
        .equal(tempBody.phone_no);
    });

    it('should return NotFound error.', async () => {
      const userId = await getLastRowId();

      const res = await chai.request(app)
        .put(`${baseUrl}/${userId + 1}`)

        .send(body);

      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('code')
        .which
        .is
        .an('number')
        .which
        .is
        .equal(404);
    });
  });

  describe(`PUT ${baseUrl}/:userId?enable=true`, async () => {
    it('should enable a user of given user id.', async () => {
      const user = await getOne({
        status: 2,
      });

      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}?enable=true`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('status')
        .which
        .is
        .equal(1);
    });

    it('should give 412 precondition error because given user is already enabled.', async () => {
      const user = await getOne({
        status: 1,
      });
      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}?enable=true`);
      res.should.have.status(412);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });

    it('should give 404 notfound error because given user is not exist.', async () => {
      const userId = await getLastRowId();

      const res = await chai.request(app)
        .put(`${baseUrl}/${userId + 1}?enable=true`);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });
  });

  describe(`PUT ${baseUrl}/:userId?enable=false`, async () => {
    it('should disable a user of given id.', async () => {
      const user = await getOne({
        status: 1,
      });

      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}?enable=false`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('user')
        .which
        .is
        .an('object')
        .that
        .has
        .property('status')
        .which
        .is
        .equal(2);
    });

    it('should give 412 precondition error because given user is already disabled.', async () => {
      const user = await getOne({
        status: 2,
      });

      const res = await chai.request(app)
        .put(`${baseUrl}/${user.id}?enable=false`);
      res.should.have.status(412);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });

    it('should give 401 notfound error because given user is not exist.', async () => {
      const userId = await getLastRowId();

      const res = await chai.request(app)
        .put(`${baseUrl}/${userId + 1}?enable=false`);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });
  });

  describe(`GET ${baseUrl}/`, () => {
    it('should return list of user', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('users')
        .which
        .is
        .an('array');
    });

    it('should return list of user with status = 2', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}?status=2`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('users')
        .which
        .is
        .an('array');
    });

    it('should return list of users of given ids  ', async () => {
      const users = await getList({ status: 1 });
      const ids = (users.map((user) => user.id)).join(';');
      const res = await chai.request(app)
        .get(`${baseUrl}?ids=${ids}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('users')
        .which
        .is
        .an('array');
    });

    it('should return list of users which contains 111', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}?search=111`) // at least 3 char needed
        ;

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('users')
        .which
        .is
        .an('array');
    });

    it('should give validation error because parameters [sort_by] can not be empty.', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}?sort_by=`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because page_no can not be a garbage value.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?page_no=@#78sdac`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because page_no can not be a string.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?page_no=abc`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because status can not be more than 2', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?status=6`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because status can not be a decimal value.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?status=22.45`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because status can not be a negative value.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?status=-1`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because status can not be other than 0, 1 or 2.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?status=167445774435678`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });

    it('should give validation error because duplicate parameters are not allowed.', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}?sort_by=id&page_no=1&sort_by=id`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });
  });

  describe(`GET ${baseUrl}/count`, async () => {
    it('should return count of users', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/count`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('count')
        .which
        .is
        .an('number');
    });

    it('should return count of users for status 1', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/count?status=1`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('count')
        .which
        .is
        .an('number');
    });

    it('should return count of users contains 111', async () => {
      const res = await chai.request(app)
        .get(`${baseUrl}/count?search=111`) // at least 3 char needed
        ;

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('count')
        .which
        .is
        .an('number');
    });

    it('should return count of users contains ids', async () => {
      const users = await getList({});
      const res = await chai.request(app)
        .get(`${baseUrl}/count?ids=${users[0].id}`);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .that
        .has
        .property('count')
        .which
        .is
        .an('number');
    });

    it('should give validation error because status can not be more than 2', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}/count?status=6`);
      res.should.have.status(400);
      res.error.should.not.be.false;
    });
  });

  describe(`GET ${baseUrl}/userId`, async () => {
    it('should return one user of given id.', async () => {
      const user = await getOne({
        status: 1,
      });
      const res = await chai.request(app)
        .get(`${baseUrl}/${user.id}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .which
        .has
        .property('user');
    });

    it('should give 404 not found error because data is not exist in DB', async () => {
      const lastRowId = await getLastRowId();
      const res = await chai.request(app)
        .get(`${baseUrl}/${Number(lastRowId) + 1}`) // or Any imaginary number, which should not exists as user id.
        ;
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .which
        .has
        .property('message')
        .which
        .is
        .an('string');
    });

    it('should give 404 not found error because given id is a deleted user.', async () => {
      const user = await getDeletedOne();
      const res = await chai.request(app)
        .get(`${baseUrl}/${user.id}`);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .which
        .has
        .property('message')
        .which
        .is
        .an('string');
    });
  });

  describe(`DELETE ${baseUrl}/userId`, () => {
    it('should delete one of given id', async () => {
      const user = await getOne({
        status: 2,
      });
      const res = await chai.request(app)
        .delete(`${baseUrl}/${user.id}`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data')
        .which
        .is
        .an('object')
        .which
        .has
        .property('user')
        .that
        .has
        .property('deleted_at')
        .which
        .is
        .not
        .equal(null);
    });

    it('should give 412 precondition error because enable user can not be deleted.', async () => {
      const user = await getOne({
        status: 1,
      });
      const res = await chai.request(app)
        .delete(`${baseUrl}/${user.id}`);
      res.should.have.status(412);

      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });
  });

  describe('Non existing route', () => {
    it('should not return config of user', async () => {
      const res = await chai.request(app)
        .get('/non-existing-route');
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error')
        .which
        .is
        .an('object')
        .that
        .has
        .property('message')
        .which
        .is
        .an('string');
    });
  });
});
