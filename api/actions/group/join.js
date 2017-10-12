import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function join(req) {

  return new Promise((resolve, reject) => {
    const groupId = req.body._id;
    if (groupId) {
      const { _id, groups = [] } = req.body.user;
      groups.push(groupId);
      req.body.user.groups = groups;

      Admin.findOneAndUpdate({ _id }, { groups }, (err) => {
        if (err) reject({ msg: '添加失败' });
        resolve({ msg: '添加成功' });
      });
    } else {
      reject({ msg: '缺少参数' });
    }
  });

}
