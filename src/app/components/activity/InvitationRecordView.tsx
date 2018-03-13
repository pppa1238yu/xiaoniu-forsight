import * as React from "react";
import {observer} from "mobx-react";
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {invitationRecordDataSource} from "../../model/ajax/ActivityService";

class InvitationRank extends React.Component<any, any> {
    style = {
        box: {
            border: "1px solid #6a6a6a",
            width: "365px",
            height: "386px",
            borderRadius: "5px",
            marginRight: "18px",
            padding: "10px 32px 32px",
            overflow:"auto"
        },
        rankTitle: {
            textAlign: "center"
        },
        listHead: {
            fontSize: "14px",
            color: "#979797"
        },
        firstColumn: {
            width: "90px"
        },
        secondColumn: {
            width: "160px"
        }
    };

    render() {
        let inviteRecord = [];
        if (this.props.datasource) {
            let data = this.props.datasource;
            data.length?data.map((item, index) => {
                inviteRecord.push(
                    <li key={index}>
                        <div style={this.style.secondColumn}>
                            {item.a}
                        </div>
                        <div>
                            {item.b.split(' ')[0]}
                        </div>
                    </li>
                )
            }):<li key={-1}>
                <div className="no-data">
                    暂无数据
                </div>
            </li>
        }
        return <div style={this.style.box as any}>
            <div>
                <ul className="invitation-list">
                    <li style={this.style.listHead}>
                        <div style={this.style.secondColumn}>
                            会员名称
                        </div>
                        <div>
                            邀请时间
                        </div>
                    </li>

                    {inviteRecord}
                </ul>
            </div>
        </div>
    }
}

@observer
export default class InvitationRecordView extends React.Component<any, any> {
    styles = {
        container: {
            width: "967px",
            margin: "56px auto 0",
            fontSize: "14px",
            color: "#fff"
        },
        invitationTitle: {
            fontSize: "16px",
            marginBottom: "20px"
        }
    };

    componentDidMount() {
        invitationRecordDataSource.setNotifyResult(this.props.onNotifyFirstLoad3);
        invitationRecordDataSource.request();
    }

    render() {
        return <div style={this.styles.container}>
            <div style={this.styles.invitationTitle}>邀请记录</div>
            <InvitationRank datasource={invitationRecordDataSource.$}/>
        </div>
    }
}

