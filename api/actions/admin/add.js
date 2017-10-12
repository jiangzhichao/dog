import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function one(req) {

  return new Promise((resolve, reject) => {
    const { _id, selfId } = req.body;

    if (!_id) {
      reject({ msg: '不能添加空好友' });
    } else {
      saveFriends(_id, selfId);
      saveFriends(selfId, _id);
    }

    function saveFriends(a, b) {
      Admin
        .findOne({ _id: a })
        .select('friends')
        .exec((err, doc) => {
          const { friends = [] } = doc;
          if (friends.indexOf(b) > -1) {
            reject({ msg: '已经是好友了' });
          } else {
            friends.push(b);
            Admin.findOneAndUpdate({ _id: a }, { friends }, (err) => {
              if (err) {
                reject({ msg: '更新错误:' + err });
              } else {
                resolve({ msg: '更新成功' });
              }
            });
          }
        });
    }

  });
}
