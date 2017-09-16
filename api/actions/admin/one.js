import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function one(req) {

  return new Promise((resolve, reject) => {
    const { _id } = req.query;
    Admin
      .findOne({ _id })
      .populate('avatar friends groups')
      .exec((error, doc) => {
        if (error) {
          reject({ msg: '查询错误!', error });
        } else {
          if (doc) {
            doc.password = null;
            if (doc.friends.length > 0) {
              doc.friends.forEach(item => item.password = null);
            }
            resolve({ user: doc });
          } else {
            reject({ msg: '无结果' });
          }
        }
      });
  });

}
