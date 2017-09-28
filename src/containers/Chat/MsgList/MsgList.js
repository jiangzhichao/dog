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
    selectedFriend: state.message.selectedFriend,
    allMsg: state.message.allMsg,
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

    componentDidUpdate(preProps) {
        if (preProps.selectedFriend !== this.props.selectedFriend || preProps.allMsg !== this.props.allMsg) this.gotoBottom();
    }

    gotoBottom = () => {
        const ele = document.querySelectorAll('.message-line');
        if (ele.length > 0) ele[ele.length - 1].scrollIntoView();
    };

    typeRenderMsg = (msg, i) => {
        if (msg.fileInfo) {
            return (
                <Upload
                    onPreview={() => {
                        this.props.change({ previewVisible: true, previewImageUrl: msg.path });
                    }}
                    onRemove={false}
                    action=""
                    listType="picture-card"
                    fileList={[msg.fileInfo.file]}
                />
            );
        }

        if (msg.file && msg.file.type.indexOf('image') > -1) {
            return (<Upload
                onPreview={() => {
                    this.props.change({ previewVisible: true, previewImageUrl: msg.file.path });
                }}
                onRemove={false}
                action=""
                listType="picture-card"
                fileList={[{
                    uid: i,
                    name: '',
                    status: 'done',
                    url: msg.file.path,
                }]}
            />);
        }

        if (msg.file) {
            return (<a download={msg.file.name} href={msg.file.path}>{msg.content}</a>);
        }

        return msg.content;
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
                                        {this.typeRenderMsg(item, i)}
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
                        style={{ width: '100%' }}
                        src={previewImageUrl}
                    />
                </Modal>
                <WriteMsg />
            </div>
        );
    }
}
