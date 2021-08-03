const User = require('../auth/models/users');

///////////////////to add like and comments/////////////////////////////////////////

// the body should be contain the likerId , comment information ,userId, serivceId or productId
// the serivceId or productId should be send in the body under the serivceId
// for example
//  {  "userId": "6103e3bf8023340b99d1f5a2",
//     like:{
//         " likerId": "6103def6bd4f410aa50cf730",
//         "productId": "6103e3bf8023340b99d1f5a2",
//         "date": "2021-07-30T11:33:25.176Z",
//     }
// "comment":{

//        "text": "2021-07-30T11:33:25.176Z",
//        "commenterId": "6103e3bf8023340b99d1f5a2",
//        "productId": "6103e3bf8023340b99d1f5a2",
//        "date": "2021-07-30T11:33:25.176Z"

// }
// }
const addingProductsLikeAndcomment = async (req, res, next) => {
  try {
    const like = req.body.like;
    const comment = req.body.comment;
    const userId = req.body.userId;
    let count = 0;
    let idx;
    let peoductCount = 0;
    let peoductIdx;
    let deletelike = [];
    User.find({ _id: userId }, (error, data) => {
      // to add or delete like to the products
      if (like) {
        data[0].products.map((info) => {
          peoductCount++;
          if (info._id == like.productId) {
            info.likes.map((likeInfo) => {
              count++;
              if (like.likerId === likeInfo.likerId) {
                idx = count - 1;
                deletelike.push('true');
              }

              if (like.likerId !== likeInfo.likerId) {
                deletelike.push('false');
              }
            });
          }
        
        });
        peoductIdx = peoductCount - 1;
        if (deletelike.includes('true')) {
          data[0].products[peoductIdx].likes.splice([idx], 1);
        } else {
          data[0].products[peoductIdx].likes.push(req.body.like);
        }
      }

      // to add comment to the products
      if (comment) {
        data[0].products.map((info) => {
          if (info._id == comment.productId) {
            info.comments.push(comment);
          }
        });
      }
      data[0].save();

      res.json(data[0]);
    });
  } catch (error) {
    next(error);
  }
};

///////////////////to get the user information /////////////////////////////////////////
const getproducts = async (req, res) => {
  let dataArray = [];
  //  const {
  //     id,firstName,lastName,email,products,products
  //  }
  User.find({}, (error, data) => {
    data.map((info) => {
      const newuser = {
        id: info._id,
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        products: info.products,
        // products: info.products,
      };
      dataArray.push(newuser);
    });

    res.json(dataArray);
  });
};

///////////////////to update the user comment /////////////////////////////////////////
// the info in the request body
// for example
//  {  "userId": "6103e3bf8023340b99d1f5a2",  this one is the peoduct owner should be send in the params
//
// "comment":{

//     "text": "2021-07-30T11:33:25.176Z",
//     "commenterId": "6103e3bf8023340b99d1f5a2",        this is the id of comment owner
//     "productId": "6104930374fbc225c4c7203f",
//     "date": "2021-07-30T11:33:25.176Z",
//     "_id": "6103e3bf8023340b99d1f5a2",   this is the comment id

// }
// }

const editProductsComment = async (req, res) => {
  const id = req.body.userId;

  try {
    // to update the user comment
    User.find({ _id: id }, (error, data) => {
      data[0].products.map((info) => {
        if (info._id !== req.body.productId) {
          info.comments.map((commentData) => {
            if (
              commentData.commenterId == req.body.comment.commenterId &&
              commentData._id == req.body.comment._id
            ) {
              console.log(commentData[0]);
              commentData.text = req.body.comment.text;
              data[0].save();
              return res.json(data[0]);
            }
          });
        }
      });
    });
  } catch (error) {
    res.json('user not found');
  }
};

///////////////////to delete the user comment /////////////////////////////////////////

// for example
// {
//     "userId":"61047ffc031af41915d9eb5a",
//    "comment":{

//             "text": "mukhljhklrad",
//             "commenterId": "6103e3bf8023340b99d1f5a2",
//             "productId": "6104930374fbc225c4c7203f",
//             "date": "2021-07-30T11:33:25.176Z",
//             "_id": "6104b74cb303a3304c6d05c9"

//      }
//  }

const deleteProductsComment = async (req, res) => {
  const id = req.body.userId;
  let count = 0;

  try {
    // to delete the user comment
    User.find({ _id: id }, (error, data) => {
      data[0].products.map((info) => {
        if (info._id !== req.body.productId) {
          count = 0;
          info.comments.map((commentData) => {
            count++;
            if (
              commentData.commenterId == req.body.comment.commenterId &&
              commentData._id == req.body.comment._id
            ) {
              let idx = count - 1;
              info.comments.splice(idx, 1);
              data[0].save();
              res.json(data[0]);
            }
          });
        }
      });
    });
  } catch (error) {
    res.json('user not found');
  }
};
module.exports = {
  editProductsComment,
  deleteProductsComment,
  getproducts,
  addingProductsLikeAndcomment,
};
