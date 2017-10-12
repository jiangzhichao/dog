import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function all(req) {

  return new Promise((resolve, reject) => {
    const { _id } = req.query;

    Admin
      .find()
      .where({ friends: { $nin: [_id] }, _id: { $nin: [_id] } })
      .select('name _id')
      .exec((error, doc) => {
        if (error) {
          reject({ msg: '查询错误!', error });
        } else {
          if (doc) {
            resolve({ allAdmin: doc });
          } else {
            reject({ msg: '无结果' });
          }
        }
      });
  });

}
