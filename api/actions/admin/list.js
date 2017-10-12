import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function all(req) {

  return new Promise((resolve, reject) => {
    const { _id } = req.query;

    Admin
      .findOne({ _id })
      .select('friends')
      .populate({
        path: 'friends',
        select: '_id name avatar',
        populate: ({
          path: 'avatar'
        })
      })
      .exec((error, doc) => {
        if (error) {
          reject({ msg: '查询错误!', error });
        } else {
          if (doc) {
            resolve({ friends: doc.friends });
          } else {
            reject({ msg: '无结果' });
          }
        }
      });
  });

}
