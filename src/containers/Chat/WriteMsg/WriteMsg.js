/**
 * Created by jiang on 2017/9/18.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change, sendMsg, sendFileMsg, changeFileMsg, clearFileQueue } from 'redux/modules/message';
import { Upload, Icon, Input } from 'antd';
const { TextArea } = Input;
import './WriteMsg.scss';

@connect(state => ({
    writeMsg: state.message.writeMsg,
    loadCurrentMsg: state.message.loadCurrentMsg,
    socketInit: state.message.socketInit
}), { change, sendMsg, sendFileMsg, clearFileQueue, changeFileMsg })
export default class WriteMsg extends Component {
    static propTypes = {
        writeMsg: PropTypes.any,
        change: PropTypes.func,
        sendMsg: PropTypes.func,
        loadCurrentMsg: PropTypes.bool,
        socketInit: PropTypes.bool,
        sendFileMsg: PropTypes.func,
        changeFileMsg: PropTypes.func,
        clearFileQueue: PropTypes.func
    };

    render() {
        return (
            <div className="friends-tool">
                <div className="friends-img">
                    {!this.props.socketInit &&
                    <span className="socket-loading"><Icon type="loading" />  连接聊天服务器...</span>}
                    <Upload
                        name="file"
                        action="/api/uploads"
                        showUploadList={false}
                        onChange={(fileInfo) => {
                            this.props.changeFileMsg(fileInfo);
                            if (fileInfo.file.status === 'done') {
                                this.props.clearFileQueue(fileInfo);
                                this.props.sendFileMsg(fileInfo);
                            }
                        }}
                    >
                        <a><Icon type="upload" /> 上传文件</a>
                    </Upload>
                </div>
                <div className="friends-send">
            <TextArea
                disabled={this.props.loadCurrentMsg || !this.props.socketInit}
                value={this.props.writeMsg}
                onChange={(e) => {
                    this.props.change({ writeMsg: e.target.value });
                }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) this.props.sendMsg();
                }}
            />
                </div>
            </div>
        );
    }
}
