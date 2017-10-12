import mongoose from 'mongoose';
const Group = mongoose.model('Group');

export default function all(req) {

  return new Promise((resolve, reject) => {
    const { groups = [] } = req.query;

    Group
      .find()
      .where({ _id: { $nin: groups } })
      .exec((err, doc) => {
        if (err) reject({ msg: '查找错误', err });
        resolve({
          groups: doc
        });
      });
  });

}
