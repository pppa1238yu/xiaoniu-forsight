import * as React from "react";
import {Util} from "../../Constants";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import {barInteraction} from "../../components/bar/BarInteraction";
import {green500, grey500, red500, transparent} from "material-ui/styles/colors";
import RaisedButton from 'material-ui/RaisedButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import Paper from "material-ui/Paper";
import ShowMore from "../../components/common/ShowMore";
import If from "../../components/common/If";
import {tipManager} from "../../model/state/TipManager";
import {messageDatasource} from "../../model/ajax/MessageService";
import {messageTipDataSource} from "../../model/ajax/ActivityService";
import Empty from "../../components/common/Empty";
import {http} from "../../model/ajax/Http";
import {observer} from "mobx-react";
import {fixButtonManager} from "../../model/state/FixButtonManager";
import Dialog from "material-ui/Dialog";
import Time from "material-ui/svg-icons/device/access-time";
import Constants  from "../../Constants";
import FlatButton from "material-ui/FlatButton";
declare let $;

@observer
export default class MessagePage extends React.Component<any, any> {
    static path = "/message";
    static title = "消息中心";
    widthNotifier: WidthNotifier = null;

    styles = {
        container: {
            position: 'relative',
            display: 'flex',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 10,
            flexFlow: 'column',
        },
        space: {
            flexGrow: 1,
        },
        page: {
            paddingTop: 8,
        }
    };

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        messageDatasource.setMount(false);
        barInteraction.restore();
        messageDatasource.first = true;
        messageTipDataSource.messagePage = false;
    }

    componentDidMount() {
        barInteraction.title = MessagePage.title;
        messageTipDataSource.messagePage =  true;
        barInteraction.custom = true;
        if (messageDatasource.first) {
            if (Util.smallAndPortrait(this.widthNotifier.device)) {
                messageDatasource.isMore = true;
            }
            messageDatasource.request();
        }
    }

    componentWillMount() {
        this.widthNotifier = widthListener.createWidthNotifier();
        messageDatasource.setMount(true);

        if (this.props.history.action == 'POP') {
            //don't restore
        } else {
            messageDatasource.reset();
            messageDatasource.restore();
        }
        Util.scrollTopInstant();
    }

    render() {
        const small = Util.small(this.widthNotifier.device);
        const portrait = Util.portrait(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        let fixButton = small ? <FixButtonMobile/> : null;
        let content = (
            <div>
                <If condition={!small} block>
                    <div style={this.styles.container as any}>
                        <MessageDesktopPage fixDrawer={fixDrawer} portrait={portrait}/>
                    </div>
                </If>
                <If condition={small} block>
                    <MessageMobile4Page/>
                </If>
            </div>
        );
        if (messageDatasource.first) {
            if (messageDatasource.loading) {
                return (
                    <FirstLoading label="努力加载中..." mobile={small}/>
                )
            } else {
                return null;
            }
        } else {
            return (
                <div>
                    {fixButton}
                    {content}
                </div>
            )
        }
    }
}

// 消息中心Pc端
@observer
class MessageDesktopPage extends React.Component<any, any> {

    state = {
        refresh: false,
        openDialog: false,
        message: '是否删除该条消息？',
        ifAll: false,
        postData: {},
        trList:[]
    };

    styles = {
        tableStyle: {
            width: '100%',
            backgroundColor: '#fff'
        },
        container: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 10,
            display: 'flex',
            flexFlow: 'column',
            height: 'calc(100vh - 100px)'
        },
        deskPageStyle: {
            position: 'relative',
            paddingBottom: 24,
            flexGrow: 1,
            paddingTop: 10,
            display: 'flex',
            flexFlow: 'column'
        },
        centerCell: {
            textAlign: 'center'
        },
        thFir: {
            width: '4%',
            overflow: 'hidden',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center'
        },
        thOther: {
            width: '14%',
            height: '50px',
            fontSize: 14,
            lineHeight: '50px',
            overflow: 'hidden',
            textAlign: 'center'
        },
        thOtherLast: {
            width: '14%',
            height: '50px',
            fontSize: 14,
            lineHeight: '50px',
            overflow: 'hidden',
            textAlign: 'center',
            cursor: 'pointer'
        },
        imageStyle: {
            width: 32,
            verticalAlign: 'middle'
        },
        page: {
            paddingTop: 8,
        }
    };

    setError() {
        tipManager.showTip('加载出错');
    }

    setOpen = (thisObj, index) => {
        if (thisObj.attr('data-open') == 'true') {
            $('.normalTr').eq(index).attr('data-open', 'false');
            $('.messageExpandTr').eq(index).css({
                height: '0',
                padding: '0'
            });
        } else {
            thisObj.attr('data-open', 'true');
            thisObj.children('td').removeClass('important');
            $('.messageExpandTr').eq(index).css({
                height: 'auto',
                padding: '20px'
            });
        }
    };

    showExpandTr = (index) => {
        let thisObj = $('.normalTr').eq(index);
        let id = thisObj.attr('data-id');
        let read = thisObj.attr('data-read');
        let single = thisObj.attr('data-single');
        let singleState = false;
        if (single == '-') {
            singleState = true;
        }
        if (read == 'false') {
            http.post('/messages/changeRead', {messageId: id, single: singleState})
                .then(value => {
                    messageTipDataSource.request();
                    this.setOpen(thisObj, index);
                })
                .catch(err => {
                    this.setError();
                })
        } else {
            this.setOpen(thisObj, index);
        }
        $('.mailImage').eq(index).attr('src', '/images/open.png');
    };

    cancelAjax = (data) => {
        http.post('/messages/deleteMessages', {messageIds: data})
            .then(value => {
                messageDatasource.request();
            })
            .catch(err => {
                this.setError();
            })
    };

    onPageChange = (index) => {
        messageDatasource.setRequestPageIndex(index - 1);
        messageDatasource.request(() => Util.scrollTop());
    };

    handleCancel = () => {
        this.handleClose();
        this.cancelAjax(JSON.stringify(this.state.postData));
    };

    handleClose = () => {
        this.setState({
            openDialog: false
        });
    };

    handleOpenDialog = (message?, id?, single?) => {
        let messageText = '';
        let ifSingle = false;
        let data = {};
        if (single == '-') {
            ifSingle = true;
        }
        if (message) {
            messageText = '是否删除本页所有消息？';
            messageDatasource.$.entities.map(item => {
                let ifGroup = true;
                if (item.group) {
                    ifGroup = false;
                }
                data[item.id] = ifGroup;
            });

        } else {
            messageText = '是否删除该条消息？';
            if (id) {
                data[id] = ifSingle;
            }
        }
        this.setState({
            openDialog: true,
            message: messageText,
            postData: data
        })
    };

    render() {
        const loading = messageDatasource.loading;
        if (!loading && messageDatasource.error) {
            return null;
        } else {
            const progress = loading ? <FixLoading mobile={false} transparent={true}/> : null;
            if (messageDatasource.$.totalRowCount == 0) {
                return (
                    <div style={this.styles.container as any}>
                        <Empty mobile={false} label="还没有收到消息"/>
                        {progress}
                    </div>
                );
            } else {
                let trList = [];
                messageDatasource.$.entities.map((item, index) => {
                    let imageSrc = "/images/mail.png";
                    let time = item.time.split('T')[0] || '-';
                    let type = '';
                    if (item.group) {
                        type = item.type || '-';
                    } else {
                        if (item.type) {
                            type = item.type.description;
                        } else {
                            type = '-';
                        }
                    }
                    if (item.read) {
                        imageSrc = "/images/open.png";
                        trList.push(
                            <tr className="normalTr" key={index + 't'} data-id={item.id} data-read={item.read}
                                data-single={item.group || '-'}>
                                <td style={this.styles.thFir as any} onClick={() => this.showExpandTr(index)}><img
                                    src={imageSrc}
                                    className="mailImage"
                                    style={this.styles.imageStyle}/></td>
                                <td style={this.styles.thOther as any}
                                    className=""
                                    onClick={() => this.showExpandTr(index)}>{type}</td>
                                <td style={this.styles.thOther as any}
                                    className=""
                                    onClick={() => this.showExpandTr(index)}>{item.theme}</td>
                                <td style={this.styles.thOther as any}
                                    className=""
                                    onClick={() => this.showExpandTr(index)}>{time}</td>
                                <td style={this.styles.thOther as any}
                                    onClick={() => this.handleOpenDialog(0, item.id, item.group || '-')}>
                                    <RaisedButton
                                        label="删除"
                                        icon={<DeleteIcon color={grey500} style={{width: '18px', height: '18px'}}/>}
                                        labelStyle={{fontSize: 12, color: '#000'}}
                                        labelColor='#fff'
                                        style={{background: 'transparent', boxShadow: 'none'}}
                                    />
                                </td>
                            </tr>
                        );
                    } else {
                        imageSrc = "/images/mail.png";
                        trList.push(
                            <tr className="normalTr" key={index + 't'} data-id={item.id} data-read={item.read}
                                data-single={item.group || '-'}>
                                <td style={this.styles.thFir as any} onClick={() => this.showExpandTr(index)}><img
                                    src={imageSrc}
                                    className="mailImage"
                                    style={this.styles.imageStyle}/></td>
                                <td style={this.styles.thOther as any} onClick={() => this.showExpandTr(index)}
                                    className="important">{type}</td>
                                <td style={this.styles.thOther as any} onClick={() => this.showExpandTr(index)}
                                    className="important">{item.theme}</td>
                                <td style={this.styles.thOther as any} onClick={() => this.showExpandTr(index)}
                                    className="important">{time}</td>
                                <td style={this.styles.thOther as any}
                                    onClick={() => this.handleOpenDialog(0, item.id, item.group || '-')}
                                    className="important">
                                    <RaisedButton
                                        label="删除"
                                        icon={<DeleteIcon color={grey500} style={{width: '18px', height: '18px'}}/>}
                                        labelStyle={{fontSize: 12, color: '#000'}}
                                        labelColor='#fff'
                                        style={{background: 'transparent', boxShadow: 'none'}}
                                    />
                                </td>
                            </tr>
                        );
                    }
                    trList.push(
                        <tr key={index + 's'}>
                            <td colSpan={5}>
                                <div className="messageExpandTr">
                                    {item.content}
                                </div>
                            </td>
                        </tr>
                    );
                });

                return (
                    <div>
                        {progress}
                        <DialogBox open={this.state.openDialog} handleClose={this.handleClose}
                                   message={this.state.message}
                                   handleCancel={this.handleCancel}
                        />
                        <div style={this.styles.deskPageStyle as any}>
                            <div className="fix-stocks fix-message-width">
                                <table style={this.styles.tableStyle} className="messageTable">
                                    <thead>
                                    <tr>
                                        <th style={this.styles.thFir as any}><img src="./images/mail.png"
                                                                                  style={this.styles.imageStyle}/></th>
                                        <th style={this.styles.thOther as any}>类别</th>
                                        <th style={this.styles.thOther as any}>主题</th>
                                        <th style={this.styles.thOther as any}>时间</th>
                                        <th style={this.styles.thOtherLast as any}
                                            onClick={() => this.handleOpenDialog(1)}>全部删除
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="messageTbody">
                                    {trList}
                                    </tbody>
                                </table>
                            </div>
                            <div className="center-align" style={this.styles.page}>
                                <Paper role="pageTurner" className="fix-message-width">
                                    <UltimatePaginationMaterialUi
                                        currentPage={messageDatasource.$.pageIndex + 1}
                                        totalPages={messageDatasource.$.pageCount}
                                        hideFirstAndLastPageLinks={true}
                                        onChange={this.onPageChange}/>
                                </Paper>
                            </div>
                        </div>
                    </div>
                )
            }
        }

    }
}

// 移动端fixbutton
class FixButtonMobile extends React.Component<any, any> {

    componentWillMount() {
        fixButtonManager.showOnlyUp();
    }

    componentWillUnmount() {
        fixButtonManager.hidden();
    }

    render() {
        return (
            <div/>
        );
    }
}

// 删除消息弹窗
class DialogBox extends React.Component<any, any> {
    render() {
        const actions = [
            <FlatButton
                label="确认"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.props.handleCancel}
            />,
        ];
        return (
            <Dialog
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight
            >
                {this.props.message}
            </Dialog>
        )
    }
}
// 消息中心移动端
@observer
class MessageMobile4Page extends React.Component<any, any> {

    state = {
        refresh: false,
        openDialog: false,
        message: '是否删除该条消息？',
        ifAll: false,
        postData: {}
    };

    styles = {
        listStyle: {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            flexWrap: 'wrap',
            verticalAlign: 'middle'
        },
        iconBox: {
            position: 'relative',
            width: '15%',
            textAlign: 'center'
        },
        ulStyle: {
            listStyle: 'none',
            marginLeft: '-40px'
        },
        contentBox: {
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            width: '70%',
            boxSizing: 'border-box',
            padding: '20px 0px 15px 0px',
            borderBottom: '1px solid #ccc'
        },
        imageStyle: {
            width: 32,
            verticalAlign: 'middle',
            marginTop: 25
        },
        padding: {
            padding: 20,
            margin: 0,
            fontSize: 12,
            backgroundColor: '#f2f2f2'
        },
        back: {
            backgroundColor: '#fff'
        },
        page: {
            paddingTop: '8px'
        }

    };

    setError() {
        tipManager.showTip('加载出错');
    }

    setOpen = (obj, open) => {
        if (open == 'false') {
            obj.attr('data-open', 'true');
            obj.css({
                height: 'auto',
                borderBottom: '1px dashed #ccc'
            })
        } else {
            obj.attr('data-open', 'false');
            obj.css({
                height: 0,
                borderBottom: 'none'
            })
        }
    };

    handleClose = () => {
        this.setState({
            openDialog: false
        });
    };

    handleOpenDialog = (message?, id?, single?) => {
        let messageText = '';
        let ifSingle = false;
        let data = {};
        if (single == '-') {
            ifSingle = true;
        }
        if (message) {
            messageText = '是否删除本页所有消息？';
            messageDatasource.$.entities.map(item => {
                let ifGroup = true;
                if (item.group) {
                    ifGroup = false;
                }
                data[item.id] = ifGroup;
            });

        } else {
            messageText = '是否删除该条消息？';
            if (id) {
                data[id] = ifSingle;
            }
        }
        this.setState({
            openDialog: true,
            message: messageText,
            postData: data
        })
    };

    handleCancel = () => {
        this.handleClose();
        this.cancelAjax(JSON.stringify(this.state.postData));
    };

    onPageChange = (index) => {
        messageDatasource.setRequestPageIndex(index - 1);
        messageDatasource.request(() => Util.scrollTop());
    };

    // 展开消息列表
    openExpand = (index, read) => {
        // let messageClass = $('.messageContent').eq(index).children('div').children('p').attr('class');
        let expandBox = $('.messageExpandBox').eq(index);
        let open = expandBox.attr('data-open');
        let id = expandBox.attr('data-id');
        let messageContent = $('.messageContent').eq(index);
        let dataGroup = expandBox.attr('data-group');
        let singleState = false;
        if (dataGroup === '-') {
            singleState = true;
        }
        if (!read) {
            http.post('/messages/changeRead', {messageId: id, single: singleState})
                .then(value => {
                    this.setOpen(expandBox, open);
                })
                .catch(err => {
                    this.setError();
                });
            $('.mailImg').eq(index).attr('src', '/images/open.png');
            messageContent.children().removeClass('messageNormalP').addClass('messageSmallP');
            messageContent.children().children().removeClass('messageNormalP').addClass('messageSmallP');
        } else {
            this.setOpen(expandBox, open);
        }
    };

    cancelAjax = (data) => {
        http.post('/messages/deleteMessages', {messageIds: data})
            .then(value => {
                messageDatasource.clearMore = true;
                messageDatasource.request();
            })
            .catch(err => {
                this.setError();
            })
    };

    componentDidMount() {
        messageDatasource.message = true;
        messageDatasource.clearMore = true;
    }

    componentWillUnmount() {
        messageDatasource.message = false;
        messageDatasource.clearMore = false;
        messageDatasource.more = [];
    }

    render() {
        const loading = messageDatasource.loading;
        let data = messageDatasource.more;
        let showList = [];
        if (messageDatasource.$.totalRowCount == 0) {
            if (loading) {
                return (
                    <FirstLoading mobile={true}/>
                );
            }
            return (
                <div>
                    <Empty mobile label="还没有收到消息"/>
                </div>
            );
        } else {
            showList = data.map((item, index) => {
                let imgSrc = "./images/mail.png";
                let messageClass = 'messageNormalP';
                if (item.read) {
                    imgSrc = "/images/open.png";
                    messageClass = 'messageSmallP';
                }
                let time = item.time.split('T')[0] || '-';
                let type = '';
                if (item.group) {
                    type = item.type;
                } else {
                    type = item.type.description;
                }
                return (
                    <div style={this.styles.listStyle as any} key={index}>
                        <div style={this.styles.iconBox as  any} onClick={() => this.openExpand(index, item.read)}>
                            <img src={imgSrc}
                                 className="mailImg"
                                 style={this.styles.imageStyle as any}/>
                        </div>
                        <div style={this.styles.contentBox as any} className="messageContent"
                             onClick={() => this.openExpand(index, item.read)}>
                            <div>
                                <p className={messageClass}>{type}</p>
                                <p className={messageClass}>{item.theme}</p>
                            </div>
                            <div className={messageClass}>{time}</div>
                        </div>
                        <div style={this.styles.iconBox as any}
                             onClick={() => this.handleOpenDialog(0, item.id, item.group || '-')}>
                            <DeleteIcon color={grey500}
                                        style={{width: '32px', height: '32px', verticalAlign: '-38px'}}
                            />
                        </div>
                        <div className="messageExpandBox" data-open="false" data-id={item.id}
                             data-group={item.group || '-'}>
                            <p style={this.styles.padding as any}>
                                {item.content}
                            </p>
                        </div>
                    </div>
                )
            });

            const progress = loading ? <FixLoading mobile={true} transparent={true}/> : null;

            let pagination = <div className="center-align" style={this.styles.page}>
                <Paper role="pageTurner" className="fix-message-width">
                    <UltimatePaginationMaterialUi
                        currentPage={messageDatasource.$.pageIndex + 1}
                        totalPages={messageDatasource.$.pageCount}
                        hideFirstAndLastPageLinks={true}
                        onChange={this.onPageChange}/>
                </Paper>
            </div>;

            let content = (
                <div>
                    {showList}
                    {pagination}
                </div>
            );

            return (<div>
                {content}
                {progress}
                <DialogBox open={this.state.openDialog} handleClose={this.handleClose}
                           message={this.state.message}
                           handleCancel={this.handleCancel}
                />
            </div>)
        }

    }
}