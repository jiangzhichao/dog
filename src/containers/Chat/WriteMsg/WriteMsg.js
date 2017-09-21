/**
 * Created by jiang on 2017/9/18.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change } from 'redux/modules/message';
import { sendMsg } from 'redux/modules/home';
import { Upload, Button, Icon } from 'antd';

@connect(state => ({ writeMsg: state.message.writeMsg, }), { change, sendMsg })
export default class WriteMsg extends Component {
  static propTypes = {
    writeMsg: PropTypes.any,
    change: PropTypes.func,
    sendMsg: PropTypes.func
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
                if (e.keyCode === 13) this.props.sendMsg();
              }}
            />
        </div>
      </div>
    );
  }
}
