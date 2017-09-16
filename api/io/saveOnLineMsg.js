import mongoose from 'mongoose';
const Message = mongoose.model('Message');
const File = mongoose.model('File');

export default function saveOnLineMsg(data) {

  return new Promise((resolve, reject) => {

    const { file, ...message } = data;

    if (file) {
      const fileObj = new File(file);
      const messageObj = new Message(message);
      messageObj.file = fileObj._id;

      fileObj.save();
      messageObj.save((error) => {
        if (error) reject('存储message错误:' + error);
        messageObj.file = fileObj;
        resolve(messageObj);
      });
    } else {
      const messageObj = new Message(message);
      messageObj.save((error) => {
        if (error) reject('存储message错误:' + error);
        resolve(messageObj);
      });
    }

  });
}
