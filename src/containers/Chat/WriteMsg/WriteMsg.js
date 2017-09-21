/**
 * Created by jiang on 2017/9/18.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change } from 'redux/modules/message';
import { Upload, Button, Icon, message } from 'antd';

@connect(state => ({
  user: state.auth.user,
  writeMsg: state.message.writeMsg,
  selectedFriend: state.message.selectedFriend,
  onlineUsers: state.message.onlineUsers,
  allMsg: state.message.allMsg
}), { change })
export default class WriteMsg extends Component {
  static propTypes = {
    user: PropTypes.object,
    writeMsg: PropTypes.any,
    change: PropTypes.func,
    selectedFriend: PropTypes.any,
    onlineUsers: PropTypes.object,
    allMsg: PropTypes.object
  };

  render() {
    return (
      <div className="friends-tool">
        <div className="friends-img">
          <Upload
            name="file"
            action="/api/uploads"
            showUploadList={false}
          >
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </div>
        <div className="friends-send">
            <textarea
              value={this.props.writeMsg}
              onChange={(e) => {
                this.props.change({ writeMsg: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  if (!window.socket.id) {
                    message.warning('与服务器断开连接');
                    return;
                  }

                  window.socket.emit('message', {
                    message: {
                      come: this.props.user._id,
                      to: this.props.selectedFriend._id,
                      content: this.props.writeMsg,
                    },
                    id: this.props.onlineUsers[this.props.selectedFriend._id].socketId
                  });

                  this.props.allMsg[this.props.selectedFriend._id].push({
                    come: this.props.user._id,
                    to: this.props.selectedFriend._id,
                    content: this.props.writeMsg,
                  });
                  this.props.change({
                    writeMsg: '',
                    allMsg: { ...this.props.allMsg }
                  });
                }
              }}
            />
        </div>
      </div>
    );
  }
}
