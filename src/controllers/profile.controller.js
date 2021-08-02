// please note that we should edite these function and adding the number of accepted service and rejected

const User = require('../auth/models/users');
///////////////////to signin  the user information /////////////////////////////////////////
// const signin = async (req, res, next) => {
//   try {
//     const user = {
//       user: req.user,
//       token: req.user.token,
//     };
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

///////////////////to login the user information /////////////////////////////////////////

// const userLogin = async (req, res, next) => {
//   try {
//     const users = await User.find({});
//     const list = users.map((user) => user);
//     console.log(users.service);
//     res.status(200).json(list);
//   } catch (error) {
//     next(error);
//   }
// };
///////////////////to edit the user information /////////////////////////////////////////
const profileAdding = async (req, res, next) => {
  const id = req.params.id;
  try {
    const createdData = req.body;
    // const ownerEmail = req.body.email;
    User.find({ _id: id }, (error, data) => {
      console.log(data[0]);
      data[0].services.push(createdData);
      data[0].save();
      res.json(data[0].services);
    });
  } catch (error) {
    next(error);
  }
};

const addProdutcToUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const createdData = req.body;
    // const ownerEmail = req.body.email;
    User.find({ _id: id }, (error, data) => {
      console.log(data[0]);
      data[0].products.push(createdData);
      data[0].save();
      res.json(data[0].products);
    });
  } catch (error) {
    next(error);
  }
};


///////////////////to get the user information /////////////////////////////////////////
const getProfileInfo = async (req, res) => {
  const id = req.params.id;
  User.find({ _id: id }, (error, data) => {
    res.json(data[0]);
    console.log(data[0]);
  });
};

///////////////////to update the user information /////////////////////////////////////////
const editProfileInfo = async (req, res) => {
  const id = req.params.id;

  let ServiceArray = [];
  let productArray = [];
  let idStatus;
  let count = 0;

  try {
    // to update the user service
    User.find({ _id: id }, (error, data) => {
      ServiceArray = data[0].services;
      data[0].services.map((info) => {
        if (info._id !== req.body._id) {
          count++;
          idStatus = 'False';
        }
        if (info._id == req.body._id) {
          let idx = count - 1;
          idStatus = 'True';
          ServiceArray[idx] = req.body;
          data[0].services = ServiceArray;
        }
      });
      // to update the user products
      count = 0;
      if (idStatus == 'False') {
        productArray = data[0].products;
        data[0].products.map((info) => {
          if (info._id !== req.body._id) {
            idStatus == 'False';
            count++;
          }
          if (info._id == req.body._id) {
            let idx = count - 1;
            idStatus = 'True';
            productArray[idx] = req.body;
            data[0].products = productArray;
          }
        });
      }

      // to send the request to the frontend
      if (idStatus == 'True') {
        data[0].save();
        idStatus = 0;
        res.json(data[0]);
      }
      if (idStatus == 'False') {
        res.json('you can not update this service / product - not found');
      }
    });
  } catch (error) {
    res.json('user not found');
  }
};

///////////////////to delete the user information /////////////////////////////////////////
const deleteProfileInfo = async (req, res) => {
  const id = req.params.id;

  let ServiceArray = [];
  let productArray = [];
  let idStatus;
  let count = 0;

  try {
    // to update the user service
    User.find({ _id: id }, (error, data) => {
      ServiceArray = data[0].services;
      data[0].services.map((info) => {
        if (info._id !== req.body._id) {
          count++;
          idStatus = 'False';
        }
        if (info._id == req.body._id) {
          let idx = count - 1;
          idStatus = 'True';
          ServiceArray.splice(idx, 1);
          data[0].services = ServiceArray;
        }
      });
      // to update the user products
      if (idStatus == 'False') {
        productArray = data[0].products;
        data[0].products.map((info) => {
          if (info._id !== req.body._id) {
            idStatus == 'False';
            count++;
          }
          if (info._id == req.body._id) {
            let idx = count - 1;
            idStatus = 'True';
            productArray.splice(idx, 1);
            data[0].products = productArray;
          }
        });
      }

      // to send the request to the frontend
      if (idStatus == 'True') {
        data[0].save();
        idStatus = 0;
        res.json(data[0]);
      }
      if (idStatus == 'False') {
        res.json('you can not delete this service / product - not found');
      }
    });
  } catch (error) {
    res.json('user not found');
  }
};
module.exports = {
  editProfileInfo,
  deleteProfileInfo,
  getProfileInfo,
  profileAdding,
  addProdutcToUser,
  // userLogin,
  // signin,
};
