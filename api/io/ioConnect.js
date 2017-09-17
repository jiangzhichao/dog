/**
 * Created by jiang on 2017/3/6.
 */
import saveOnLineMsg from './saveOnLineMsg';

export default function ioConnect(io, runnable) {

  let onlineSum = 0;
  io.path('/ws');

  io.on('connection', (socket) => {

    onlineSum++;
    console.log('在线人数:', onlineSum);

    socket.on('login', data => {
      socket.user = data;

      socket.broadcast.emit('info', { type: 'success', text: data.name + '上线' });
      io.sockets.emit('onlineInfo', { type: 'success', text: onlineSum + '人在线' });
    });

    // socket.on('name', (data) => {
    //   const { _id, name } = data;
    //   socket.name = name;
    //   socket._id = _id;
    //
    //   const sockets = io.sockets.sockets;
    //   const onlineObj = {};
    //   Object.keys(sockets).forEach((item) => {
    //     onlineObj[sockets[item]._id] = {
    //       id: item,
    //       name: sockets[item]['name']
    //     };
    //   });
    //   io.sockets.emit('onlineObj', onlineObj);
    //
    //   socket.broadcast.emit('new', { type: 'success', text: name + '上线' });
    //   io.sockets.emit('info', { type: 'success', text: onlineSum + '人在线' });
    // });

    socket.on('disconnect', () => {
      onlineSum--;

      const sockets = io.sockets.sockets;
      const onlineObj = {};
      Object.keys(sockets).forEach((item) => {
        onlineObj[sockets[item]._id] = {
          id: item,
          name: sockets[item]['name']
        };
      });
      io.sockets.emit('onlineObj', onlineObj);
      io.sockets.emit('info', { type: 'success', text: onlineSum + '人在线' });
      socket.broadcast.emit('off', { type: 'warning', text: socket.name + '下线' });

      console.log('在线人数:', onlineSum);
    });

    socket.on('message', (data) => {
      const { id, message } = data;
      const toSocket = io.sockets.sockets[id];

      message.is_offline = !toSocket;

      saveOnLineMsg(message).then((doc) => {
        toSocket.emit('message', doc);
      });
    });

    socket.on('create', (data) => {
      const { id } = data;
      const toSocket = io.sockets.sockets[id];
      toSocket.emit('create', {});
    });

  });

  io.listen(runnable);
}