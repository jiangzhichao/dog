import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import http from 'http';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import dbConfig from './config';
import ConnectMongo from 'connect-mongo';
import upload from 'jquery-file-upload-middleware';
import path from 'path';
import ioConnect from './io/ioConnect';
import resClear from './utils/resClear';

const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);
const MongoStore = ConnectMongo(session);
const { db, sessionDbConf, sessionDb, uploadConfig } = dbConfig;

// upload.configure(uploadConfig);
mongoose.connect(db);

app.use(session({ ...sessionDbConf, store: new MongoStore({ url: sessionDb }) }));
app.use('/uploads', (req, res, next) => {
  upload.fileHandler({
    uploadDir: () => path.join(__dirname, '../uploads', (req.session.user ? '/' + req.session.user._id : '')),
    uploadUrl: () => '/uploads'
  })(req, res, next);
});
app.use(bodyParser.json({ limit: '5mb' }));
app.use(resClear(actions));

const runnable = app.listen(config.apiPort, (err) => {
  if (err) console.error(err);
  console.info('\n==> 💻  api ==> ', config.apiHost, ':', config.apiPort, '\n');
});

ioConnect(io, runnable);
