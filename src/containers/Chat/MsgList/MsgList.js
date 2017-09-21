/**
 * Created by jiang on 2017/9/18.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Upload, Modal } from 'antd';
import { change } from 'redux/modules/message';
import WriteMsg from '../WriteMsg/WriteMsg';
import './MsgList.scss';

@connect(state => ({
  user: state.auth.user,
  selectedFriend: state.friendsList.selectedFriend,
  allMsg: state.home.allMsg,
  previewVisible: state.message.previewVisible,
  previewImageUrl: state.message.previewImageUrl,
}), { change })
export default class MsgList extends Component {
  static propTypes = {
    user: PropTypes.object,
    allMsg: PropTypes.object,
    selectedFriend: PropTypes.object,
    change: PropTypes.func,
    previewImageUrl: PropTypes.any,
    previewVisible: PropTypes.bool,
  };

  componentDidMount() {
    this.gotoBottom();
  }

  componentDidUpdate() {
    this.gotoBottom();
  }

  gotoBottom = () => {
    const ele = document.querySelectorAll('.message-line');
    if (ele.length > 0) ele[ele.length - 1].scrollIntoView();
  };

  render() {
    const {
      allMsg,
      selectedFriend,
      user,
      previewVisible,
      previewImageUrl,
    } = this.props;

    return (
      <div className="friends-right">
        <div className="friends-message">
          {
            (allMsg[selectedFriend._id] || []).map((item, i) => {
              return (
                <div className="message-line" key={i}>
                  <div className={item.come === (user || {})._id
                    ? 'message-left' : 'message-right'}>
                    {
                      (item.file ? ( item.file.type.indexOf('image') > -1 ?
                            <Upload
                              onPreview={() => {
                                this.props.change({ previewVisible: true, previewImageUrl: item.file.path });
                              }}
                              onRemove={false}
                              action=""
                              listType="picture-card"
                              fileList={[{
                                uid: i,
                                name: 'xxx',
                                status: 'done',
                                url: item.file.path,
                              }]}
                            /> :
                            <a download={item.file.name} href={item.file.path}>{item.content}</a>
                        ) : item.content)
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
        <Modal
          width={800}
          visible={previewVisible}
          footer={null}
          onCancel={() => {
            this.props.change({ previewVisible: false });
          }}>
          <img
            alt="example"
            style={{ width: '100%' }}
            src={previewImageUrl}
          />
        </Modal>
        <WriteMsg />
      </div>
    );
  }
}
