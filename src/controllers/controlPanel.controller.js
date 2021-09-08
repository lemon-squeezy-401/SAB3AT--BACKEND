const User = require('../auth/models/users');

///////////////////to add user account/////////////////////////////////////////

// Note : we should send all data as user schema

// {
//     firstName: string,
//     lastName: string,
//     email: email@email.com,
//     password: 'pasword',
//     role: 'user' or 'editor'or 'admin'
//     services: [],
//     products: []
//   }

const addAcount = (req, res, next) => {
  const adminId = req.params.id;
  User.find({ _id: adminId }, async (error, data) => {
    if (data[0].role === 'admin') {
      try {
        let user = new User(req.body);
        const userRecord = await user.save();
        const output = {
          user: userRecord,
          token: userRecord.token,
        };
        res.status(201).json(output);
      } catch (e) {
        next(e.message);
      }
    } else {
      res.send('NOT Autherized');
    }
  });
};

///////////////////to get all  users information /////////////////////////////////////////
const getUsers = async (req, res) => {
  const adminId = req.params.id;
  User.find({ _id: adminId} , (error, adminData) => {
    if(adminData[0].role === 'admin') {
      try {
        User.find({}, (error, data) => {
          res.json(data);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      res.send('NOT Autherized');
    }
  });
};

///////////////////to update the user information /////////////////////////////////////////
// Note : we should send all data as user schema

// {   userId:id,
//     firstName: string,
//     lastName: string,
//     email: email@email.com,
//     role: 'user' or 'editor'or 'admin'
//     services: [],
//     products: []
// }

const editUserInfo = async (req, res) => {
  const id = req.body.userId;
  const info = req.body;
  const adminId = req.params.id;
  User.find({ _id: adminId} , (error, adminData) => {
    if(adminData[0].role === 'admin') {
      try {
        // to update the user comment
        User.find({ _id: id }, (error, data) => {
          data[0].firstName = info.firstName;
          data[0].lastName = info.lastName;
          data[0].email = info.email;
          data[0].role = info.role;
          data[0].services = info.services;
          data[0].products = info.products;
          data[0].save();
          res.json(data[0]);
        });
      } catch (error) {
        res.json('user not found');
      }
    } else {
      res.send('NOT Autherized');
    }
  });
};

///////////////////to delete the user account /////////////////////////////////////////

// {   userId:id  }

const deleteUser = async (req, res) => {
  const _id = req.body.userId;
  const adminId = req.params.id;
  User.find({ _id: adminId} , (error, adminData) => {
    if(adminData[0].role === 'admin') {
      try {
        User.findByIdAndDelete(_id, (error, data) => {
          res.send(data);
        });
      } catch (error) {
        res.json('user not found');
      }
    } else {
      res.send('NOT Autherized');
    }
  });
};

module.exports = {
  editUserInfo,
  deleteUser,
  getUsers,
  addAcount,
};