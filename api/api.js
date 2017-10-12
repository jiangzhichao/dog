import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import upload from 'jquery-file-upload-middleware';
import path from 'path';

import config from '../src/config';
import * as actions from './actions/index';
import dbConfig from './config';
import ioConnect from './io/ioConnect';
import resClear from './utils/resClear';
import tokenVerify from './utils/tokenVerify';
// import log from './utils/log';

const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);
const { db } = dbConfig;

mongoose.connect(db);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(tokenVerify);
app.use('/uploads', (req, res, next) => {
    upload.fileHandler({
        uploadDir: () => path.join(__dirname, '../uploads', (req.token ? '/' + req.token._id : '')),
        uploadUrl: () => '/uploads'
    })(req, res, next);
});
// app.use(log());
app.use(resClear(actions));

const runnable = app.listen(config.apiPort, (err) => {
    if (err) console.error(err);
    console.info('\n==> 💻  api ==> ', config.apiHost, ':', config.apiPort, '\n');
});

ioConnect(io, runnable);
