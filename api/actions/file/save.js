import mongoose from 'mongoose';
const File = mongoose.model('File');

export default function save(req) {

  return new Promise((resolve, reject) => {

    const { file } = req.body;

    const fileObj = new File(file);
    fileObj.save((err) => {
      if (err) reject({ msg: '保存错误', error });
      resolve({ msg: '保存成功' });
    });
  });

}
