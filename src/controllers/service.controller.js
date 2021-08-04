const User = require('../auth/models/users');

///////////////////to add like and comments/////////////////////////////////////////

// the body should be contain the likerId , comment information ,userId, serivceId or productId
// the serivceId or productId should be send in the body under the serivceId
// for example
//  {  "userId": "6103e3bf8023340b99d1f5a2",
//     like:{
//         " likerId": "6103def6bd4f410aa50cf730",
//         "serivceId": "6103e3bf8023340b99d1f5a2",
//         "date": "2021-07-30T11:33:25.176Z",
//     }
// "comment":{

//        "text": "2021-07-30T11:33:25.176Z",
//        "commenterId": "6103e3bf8023340b99d1f5a2",
//    "serivceId": "6103e3bf8023340b99d1f5a2",
//        "date": "2021-07-30T11:33:25.176Z"

// }
// }
const addingLikeAndcomment = async (req, res, next) => {
  try {
    const like = req.body.like;
    const comment = req.body.comment;
    const userId = req.body.userId;
    let count = 0;
    let idx;
    let serviceCount = 0;
    let serviceIdx;
    let deletelike = [];
    User.find({ _id: userId }, (error, data) => {
      // to add or delete like to the services
      if (like) {
        data[0].services.map((info) => {
          serviceCount++;
          if (info._id == like.serivceId) {
            // console.log(info);
            // console.log(serviceCount);
            info.likes.map((likeInfo) => {
              count++;
              // console.log('count',count);
              if (like.likerId === likeInfo.likerId) {
                idx = count - 1;
                deletelike.push('true');
              }

              if (like.likerId !== likeInfo.likerId) {
                deletelike.push('false');
              }
            });
            serviceIdx = serviceCount - 1;
            if (deletelike.includes('true')) {
              data[0].services[serviceIdx].likes.splice([idx], 1);
            } else {
              data[0].services[serviceIdx].likes.push(req.body.like);
            }
          }
        });

      }

      // to add comment to the services
      if (comment) {
        data[0].services.map((info) => {
          if (info._id == comment.serivceId) {
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

///////////////////to get all  user information /////////////////////////////////////////
const getServices = async (req, res) => {
  let dataArray = [];

  User.find({}, (error, data) => {
    data.map((info) => {
      const newuser = {
        id: info._id,
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        services: info.services,
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
//  {  "userId": "6103e3bf8023340b99d1f5a2",  this one is the service owner should be send in the params
//
// "comment":{

//     "text": "2021-07-30T11:33:25.176Z",
//     "commenterId": "6103e3bf8023340b99d1f5a2",        this is the id of comment owner
//     "serivceId": "6104930374fbc225c4c7203f",
//     "date": "2021-07-30T11:33:25.176Z",
//     "_id": "6103e3bf8023340b99d1f5a2",   this is the comment id

// }
// }

const editComment = async (req, res) => {
  const id = req.body.userId;

  try {
    // to update the user comment
    User.find({ _id: id }, (error, data) => {
      data[0].services.map((info) => {
        if (info._id !== req.body.serivceId) {
          info.comments.map((commentData) => {
            if (
              commentData.commenterId == req.body.comment.commenterId &&
              commentData._id == req.body.comment._id
            ) {
              commentData.text = req.body.comment.text;
              data[0].save();
              return res.json(data[0]);
            }
          });
        } else {
          res.send('service not found');
        }
      });
    });
  } catch (error) {
    res.json('user not found');
  }
};

/** 
 * to delete user comment
 for example
 {
     "userId":"61047ffc031af41915d9eb5a",
    "comment":{

             "text": "mukhljhklrad",
             "commenterId": "6103e3bf8023340b99d1f5a2",
             "serivceId": "6104930374fbc225c4c7203f",
             "date": "2021-07-30T11:33:25.176Z",
             "_id": "6104b74cb303a3304c6d05c9"

      }
  }
*/
const deleteComment = async (req, res) => {
  const id = req.body.userId;
  let count = 0;

  try {
    // to delete the user comment
    User.find({ _id: id }, (error, data) => {
      data[0].services.map((info) => {
        if (info._id !== req.body.serivceId) {
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
  editComment,
  deleteComment,
  getServices,
  addingLikeAndcomment,
};
