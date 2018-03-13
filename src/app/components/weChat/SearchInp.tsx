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
import {StockEntries} from "../../model/entities/StockEntries";
import {http} from "../../model/ajax/Http";
import If from "../common/If";
import TextField from 'material-ui/TextField';

interface Props {
    initialOpen?: boolean;
    disableExpandable?: boolean;
    limit?: number;
    newWindow?: boolean;
    buttonStyle?: any;
    inputStyle?: any;
    link?: string;
    scrollTop?:any;
}

@observer
export default class SearchInp extends React.Component<Props, null> {

    @observable private inputText: string;

    @observable private loading: number = 0;

    @observable private readonly stocks: Array<StockEntries> = [];

    @observable private errorMessage: string;

    @observable private dropdownOpening: boolean = false;

    @observable private selectedSymbol: string;

    @observable private dialogOpening: boolean = false;

    @observable private dialogShownOnce = false;

    private textField: HTMLInputElement;

    private styles = {
        layoutRow: {
            display: 'flex',
            alignItems: 'flex-end',
            margin: '20px'
        },
        layoutLeftCell: {
            flexGrow: 1
        },
        layoutRightCell: {
            marginLeft: '20px'
        },
        input: {
            width: '100%',
            outline: 'none',
            border: 'none',
            lineHeight: '30px',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: grey200
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
        },
        relative: {
            position: 'relative',
            borderRadius: '6px',
            overflow: 'hidden',
            height:'40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        },
        konwn: {
            color: '#ff2220',
            padding: '5px 10px'
        }
    };

    scrollTop = () => {
      this.props.scrollTop();
    };

    render() {
        return (
            <div>
                <div style={this.styles.relative as any}>
                    <input type="text"
                        style={this.props.inputStyle}
                        placeholder="输入股票代码或名称"
                        ref={element => {this.textField = element; }}
                        value={this.inputText}
                        onChange={() => {this.onInputChange();}}
                        onClick={() => {this.onInputChange();}}
                        onFocus={ this.scrollTop}
                        onKeyDown={e => {this.onInputKeyDown(e);}}
                    />
                    {/*<TextField*/}
                        {/*hintText="输入股票代码或名称"*/}
                        {/*ref={element => {*/}
                            {/*this.textField = element;*/}
                        {/*}}*/}
                        {/*value={this.inputText}*/}
                        {/*onChange={(event, value) => {*/}
                            {/*this.inputText = value;*/}
                            {/*this.onInputChange();*/}
                        {/*}}*/}
                        {/*onClick={(event, value) => {*/}
                            {/*// this.inputText = value;*/}
                            {/*this.onInputChange();*/}
                        {/*}}*/}
                        {/*onKeyDown={e => {*/}
                            {/*this.onInputKeyDown(e);*/}
                        {/*}}*/}
                    {/*/>*/}
                    <button
                           style={this.props.buttonStyle}
                           onClick={e => {
                               this.onButtonClick(e)
                           }}
                    >搜索</button>
                    {/*<RaisedButton*/}
                    {/*buttonStyle={this.props.buttonStyle}*/}
                    {/*label="搜索"*/}
                    {/*labelColor="#fff"*/}
                    {/*backgroundColor="#ff9c0d"*/}
                    {/*disabled={this.dialogShownOnce && this.stocks.length != 1}*/}
                    {/*onClick={e => {*/}
                    {/*this.onButtonClick(e)*/}
                    {/*}}*/}
                    {/*/>*/}
                </div>
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
                        <span
                            onClick={() => {
                                this.dialogOpening = false;
                            }}
                            style={this.styles.konwn}
                        >
                            知道了
                        </span>
                    ]}
                    modal={true}
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
                .get("/suggestion_alone.json", {key: pattern, type: 'STOCK', limit: limit})
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
            window.open(this.props.link + '?symbol=' + symbol);
        } else {
            document.location.assign(this.props.link + '?symbol=' + symbol);
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
            }
            this.loading--;
        });
    }
}