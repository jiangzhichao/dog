import mongoose from 'mongoose';
const Group = mongoose.model('Group');

export default function add(req) {

  return new Promise((resolve, reject) => {
    const { name, _id } = req.body;

    const groupObj = new Group({ name, creator: _id });

    groupObj.save((err) => {
      if (err) reject({ msg: '创建失败' });
      resolve({ msg: '创建群组成功' });
    });
  });

}
