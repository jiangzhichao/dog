import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAdminList, change, addAdmin } from 'redux/modules/admin';
import { change as changeFriendsList, loadFriends } from 'redux/modules/message';
import { Select, Button } from 'antd';
import './AddAdmin.scss';
const Option = Select.Option;

@connect(state => ({
    adminList: state.admin.adminList,
    selectedAdmin: state.admin.selectedAdmin
}), {
    getAdminList,
    change,
    addAdmin,
    changeFriendsList,
    loadFriends
})
export default class AddAdmin extends Component {
    static propTypes = {
        adminList: PropTypes.array,
        selectedAdmin: PropTypes.string,
        change: PropTypes.func,
        getAdminList: PropTypes.func,
        addAdmin: PropTypes.func,
        loadFriends: PropTypes.func,
        changeFriendsList: PropTypes.func
    };

    componentDidMount() {
        this.props.getAdminList();
    }

    render() {
        const { adminList, selectedAdmin } = this.props;
        return (
            <div className="add-admin-content">
                <Select
                    value={selectedAdmin}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="选择你想添加的好友"
                    optionFilterProp="children"
                    onChange={(e) => {
                        this.props.change({ selectedAdmin: e });
                    }}
                >
                    {adminList.map((item, i) => <Option key={i} value={item._id}>{item.name}</Option>)}
                </Select>
                <Button
                    onClick={() => {
                        this.props.addAdmin()
                            .then(() => {
                                this.props.change({ selectedAdmin: '' });
                                this.props.getAdminList();
                                this.props.changeFriendsList({ loadFriends: false });
                                this.props.loadFriends();
                            });
                    }}
                    style={{ marginLeft: '16px' }} type="primary"
                    icon="plus"
                >添加</Button>
            </div>
        );
    }
}
