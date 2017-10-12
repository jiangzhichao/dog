import mongoose from 'mongoose';
const Message = mongoose.model('Message');

export default function all(req) {

  return new Promise((resolve, reject) => {
    const { to, come } = req.query;
    Message
      .find()
      .where({ $or: [{ come, to }, { come: to, to: come }] })
      .populate('file')
      .sort({ 'create_time': 1 })
      .exec((error, doc) => {
        if (error) {
          reject({ msg: '查询错误!: ' + error });
        } else {
          if (doc) {
            resolve({ messageList: doc });
          } else {
            reject({ msg: '无结果' });
          }
        }
      });
  });

}
