/**
 * Created by jiang on 2017/3/6.
 */
import saveOnLineMsg from './saveOnLineMsg';
import socketioJwt from 'socketio-jwt';
import config from '../config';

export default function ioConnect(io, runnable) {

    const onlineUsers = {};
    io.path('/ws');

    io
        .on('connection', socketioJwt.authorize({
            secret: config.tokenSecret,
            timeout: 15000
        }))
        .on('authenticated', (socket) => {

            socket.on('login', data => {
                socket.user = data;

                onlineUsers[data._id] = data;
                onlineUsers[data._id].socketId = socket.id;
                console.log(`在线人数: ${Object.keys(onlineUsers).length}`);

                socket.broadcast.emit('info', { type: 'success', text: data.name + '上线' });
                io.sockets.emit('onlineUsers', onlineUsers);
            });

            socket.on('disconnect', () => {
                delete onlineUsers[socket.user._id];
                console.log(`在线人数: ${Object.keys(onlineUsers).length}`);

                io.sockets.emit('onlineUsers', onlineUsers);
                socket.broadcast.emit('info', { type: 'warning', text: socket.user.name + '下线' });
            });

            socket.on('message', (data) => {
                const { id, message } = data;
                const toSocket = io.sockets.sockets[id];

                message.is_offline = !toSocket;
                saveOnLineMsg(message).then((doc) => {
                    if (toSocket) toSocket.emit('message', doc);
                });
            });
        });

    io.listen(runnable);
}