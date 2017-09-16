import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function login(req) {

  return new Promise((resolve, reject) => {

    const { name, password } = req.body;
    Admin
      .findOne({ name })
      .populate('avatar')
      .exec((error, doc) => {
        if (error) {
          reject({ msg: '登陆失败!', error });
        } else {
          if (doc) {
            if (doc.validPassword(password)) {
              doc.password = null;
              req.session.user = doc;
              setTimeout(() => {
                resolve({ user: doc });
              }, 5000);
            } else {
              reject({ msg: '密码错误' });
            }
          } else {
            reject({ msg: '用户不存在' });
          }
        }
      });
  });

}
