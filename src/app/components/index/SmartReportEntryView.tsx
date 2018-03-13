import * as React from 'react';
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import ExpandableList from "../common/ExpandableList";
import Popover from 'material-ui/Popover';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {grey900, grey500, grey200} from "material-ui/styles/colors";
import {Stock} from "../../model/entities/Stock";
import {StockEntries} from "../../model/entities/StockEntries";
import {http} from "../../model/ajax/Http";
import If from "../common/If";

interface Props {
    initialOpen?: boolean;
    disableExpandable?: boolean;
    limit?: number;
    newWindow?: boolean;
    small?: boolean;
}

@observer
export default class SmartReportEntryView extends React.Component<Props, null> {

    @observable private inputText: string;

    @observable private loading: number = 0;

    @observable private readonly stocks: Array<StockEntries> = [];

    @observable private errorMessage: string;

    @observable private dropdownOpening: boolean = false;

    @observable private selectedSymbol: string;

    @observable private dialogOpening: boolean = false;

    @observable private dialogShownOnce = false;

    @observable private zIndex = 1;

    private textField: HTMLInputElement;

    private styles = {
        layoutRow: {
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px 20px 10px 20px',
        },
        layoutLeftCell: {
            flexGrow: 1
        },
        layoutRightCell: {
            marginLeft: '-20px'
        },
        input: {
            width: '100%',
            outline: 'none',
            border: 'none',
            lineHeight: '33px',
            backgroundColor:'transparent',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            paddingLeft:'5px',
            borderBottomColor: '#9f9f9f',
        },
        inputSmall: {
            width: '120px',
            outline: 'none',
            border: 'none',
            fontSize: 12,
            lineHeight: '33px',
            backgroundColor:'transparent',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: '#9f9f9f'
        },
        dropdownRow: {
            padding: '10px'
        },
        clickable: {
            cursor: 'pointer'
        },
        selected: {
            background: grey500
        },
        shortName: {
            fontSize: '16px',
            fontWeight: 'bold'
        },
        symbol: {
            color: grey900
        }
    };

    judgeAjax = () => {
        if (this.stocks.slice().length == 1) {
            this.dialogOpening = false;
            this.dropdownOpening = false;
        }
    };

    backZindex = () => {
        this.zIndex = 1;
    };

    render() {

        let bgStyle = {
            backgroundImage:'url("./images/note.png")',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'center',
            backgroundColor:'#f1f1f1'};

        return (
            <div>
                <ExpandableList
                    initialOpen={this.props.initialOpen}
                    disableExpandable={this.props.disableExpandable}
                    backgroundColor = "transparent"
                    noPadding
                    bgStyle = {bgStyle}
                    title="智能研报">
                    <div >
                        <div style={this.styles.layoutRow as any}>
                            <div style={this.styles.layoutLeftCell}>
                                <input
                                    role="smartReportInputBox"
                                    ref={element => {
                                        this.textField = element;
                                    }}
                                    type="text"
                                    style={this.props.small ? this.styles.inputSmall : this.styles.input}
                                    value={this.inputText}
                                    placeholder="请输入股票编号或简称"
                                    onChange={() => {
                                        this.onInputChange();
                                    }}
                                    onClick={() => {
                                        this.onInputChange();
                                    }}
                                    onKeyDown={e => {
                                        this.onInputKeyDown(e);
                                    }}/>
                            </div>
                            <div role="buttonOfGenerateReport" style={this.styles.layoutRightCell}>
                                <RaisedButton
                                    label="一键生成智能研报"
                                    primary={true}
                                    style={{position: 'relative', zIndex: this.zIndex}}
                                    disabled={this.dialogShownOnce && this.stocks.length != 1}
                                    onMouseEnter={this.judgeAjax}
                                    onMouseLeave={this.backZindex}
                                    onClick={e => {
                                        this.onButtonClick(e)
                                    }}/>
                            </div>
                        </div>
                        <div style={{padding: '0px 20px 10px 20px', fontSize: 14, color: '#616161'}}>
                            <p style={{
                                padding: 10,
                                fontSize: 12,
                                margin: '1px 0',
                                lineHeight: '24px'
                            }}>
                                智能研报=散户看得懂、感兴趣的个股诊断报告。基于小牛数据行业领先的人工智能技术，隆重推出智能研报功能，只要您输入股票代码/简称，即可一键智能生成一份最新的系统化、多维度的投资分析报告。</p>
                        </div>
                    </div>
                </ExpandableList>
                <Popover
                    open={this.dropdownOpening}
                    anchorEl={this.textField}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={() => {
                        this.dropdownOpening = false;
                    }}
                >
                    <If condition={this.loading != 0}>
                        <div style={this.styles.dropdownRow}>
                            <div>努力推荐选项中</div>
                            <div><LinearProgress mode="indeterminate"/></div>
                        </div>
                    </If>
                    <If condition={this.loading == 0}>
                        <If condition={this.errorMessage != null}>
                            <div style={this.styles.dropdownRow}>{this.errorMessage}</div>
                        </If>
                        <If condition={this.errorMessage == null}>
                            {
                                this.stocks.map(stock => (
                                    <div
                                        key={stock.id}
                                        data-symbol={stock.id}
                                        style={
                                            {
                                                ...this.styles.dropdownRow,
                                                ...this.styles.clickable,
                                                ...(this.selectedSymbol == stock.id ? this.styles.selected : {})
                                            }
                                        }
                                        onMouseOver={() => {
                                            this.selectedSymbol = stock.id;
                                        }}
                                        onMouseOut={() => {
                                            this.selectedSymbol = null;
                                        }}
                                        onClick={e => {
                                            this.confirm(e, stock.id);
                                        }}>
                                        <span style={this.styles.shortName as any}>{stock.name}</span>
                                        <span style={this.styles.symbol as any}>&nbsp;-&nbsp;{stock.id}</span>
                                    </div>
                                ))
                            }
                        </If>
                    </If>
                </Popover>
                <Dialog
                    title="请输入股票信息"
                    actions={[
                        <FlatButton
                            label="知道了"
                            primary={true}
                            onTouchTap={() => {
                                this.dialogOpening = false;
                            }}
                        />
                    ]}
                    modal={true}
                    style={{zIndex: 2003}}
                    open={this.dialogOpening}>
                    必须输入某个股票的编号或简称才能生成智能研报
                </Dialog>
            </div>

        );
    }

    private onInputChange() {
        this.inputText = this.textField.value;
        this.openMenu();
    }

    private onInputKeyDown(e) {
        let code = e.keyCode;
        if (code == 38 || code == 40) {
            let index = -1;
            let len = this.stocks.length;
            if (this.selectedSymbol != '') {
                for (let i = 0; i < len; i++) {
                    if (this.stocks[i].id == this.selectedSymbol) {
                        index = i;
                        break;
                    }
                }
            }
            if (index == -1) {
                index = 0;
            } else if (code == 38) { //Up
                index = index > 0 ? index - 1 : len - 1;
            } else if (code == 40) {
                index = index < len - 1 ? index + 1 : 0;
            }
            this.selectedSymbol = this.stocks[index].id;
            e.preventDefault();
        } else if (code != 13) {
            this.selectedSymbol = null;
        }
        if (code == 13 && this.selectedSymbol != '') {
            if (this.stocks.slice().length == 1) {
                this.confirm(e, this.stocks.slice()[0].id);
            } else {
                if (this.selectedSymbol != null || this.selectedSymbol != undefined) {
                    this.confirm(e, this.selectedSymbol);
                } else {
                    this.dialogOpening = true;
                    this.dropdownOpening = false;
                }
            }
            e.preventDefault();
        }
    }

    private onButtonClick(e) {
        if (this.stocks.length != 1) {
            this.dialogOpening = true;
            this.dropdownOpening = false;
            this.dialogShownOnce = true;
        } else {
            this.confirm(e, this.stocks[0].id);
        }
    }

    private openMenu() {
        let pattern = this.inputText;
        this.dropdownOpening = true;
        if (pattern.length == 0) {
            this.stocks.splice(0, this.stocks.length);
            this.errorMessage = null;
        } else {
            let limit = typeof this.props.limit == 'number' ? this.props.limit : 5;
            this.loading++;
            http
                .get("/suggestion_alone.json", {key: pattern, type: 'STOCK_NOT_SHOW_DELISTED', limit: limit})
                .then(data => {
                    if (data.length == 0) {
                        this.ajaxReturn({message: "无法获取推荐选项"});
                    } else {
                        this.ajaxReturn(data);
                    }
                })
                .catch(err => {
                    this.ajaxReturn({message: "无法获取推荐选项"});
                });
        }
    }

    private confirm(e, symbol: string) {
        this.inputText = symbol;
        e.preventDefault();
        if (this.props.newWindow) {
            window.open('smartReport.html#smartReport?symbol=' + symbol);
        } else {
            document.location.assign('smartReport.html#smartReport?symbol=' + symbol);
        }
    }

    private ajaxReturn(data) {
        runInAction(() => {
            this.stocks.splice(0, this.stocks.length);
            this.errorMessage = null;
            if (data.message) {
                this.errorMessage = data.message;
            } else {
                let stocks: Array<StockEntries> = data;
                this.stocks.push(...stocks);
                if (this.stocks.slice().length == 1) {
                    this.zIndex = 2002;
                }
            }
            this.loading--;
        });
    }
}