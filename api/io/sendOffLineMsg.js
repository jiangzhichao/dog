import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');
const Message = mongoose.model('Message');

export default function sendOffLineMsg(_id) {

  return new Promise((resolve, reject) => {
    Admin
      .findOne({_id})
      .select('_id message_off_line')
      .exec((error, doc) => {
        if (error) {
          reject('查询用户失败:' + error);
        } else {
          if (doc && doc.message_off_line && doc.message_off_line.length > 0) {

            const {message_off_line} = doc;
            Admin.findOneAndUpdate({_id: doc._id}, {message_off_line: []}, (error) => {
              if (error) reject('更新用户离线消息出错:' + error);
            });
            message_off_line.forEach((item) => {
              const message = new Message();
              message.come = item._id;
              message.to = item.to;
              message.msg = item;
              message.save((error) => {
                if (error) console.log('存储message错误:' + error);
              });
            });
            resolve(message_off_line);

          } else {
            reject('');
          }
        }
      });
  });

}
