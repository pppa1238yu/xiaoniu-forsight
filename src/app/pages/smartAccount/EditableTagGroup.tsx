import * as React from "react";
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import AutoComplete from 'material-ui/AutoComplete';
import {stockAttentionDataSource} from "../../model/ajax/SmartAccountService";
import {observer} from "mobx-react";
import {grey500, grey400} from "material-ui/styles/colors";
declare let $;
export default class EditableTagGroup extends React.Component<any, any> {
    inputValue = "";
    rowId = "";//表格每行中自定义标签列容器div的id
    currentIndex = -1;//选中标签的index
    firstTabChip = true;//判断是否从输入框切换到标签chip，或者相反
    myInputTab = false;//判断是否刚从幽灵input切换出来
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        }
    }

    private input;
    private myInput;

    deleteTag(removedTag) {
        this.props.deleteStockTag(this.props.inputId, removedTag);
        // this.props.tagsChange();
    }

    handleInputChange(searchText) {
        this.props.tagsChange(searchText);
        this.inputValue = searchText;
        this.setState({
            inputValue: searchText
        })
    }

    handleInputConfirm(chosenRequest) {
        if (this.inputValue) {
            //TODO
            this.props.addStockTag(this.props.inputId, chosenRequest);
            // this.props.tagsChange();
            this.inputValue = "";
            this.setState({//确定添加标签后,文本框清空
                inputValue: ""
            });
        }
    }

    keyHandle(event) {
        switch (event.keyCode) {
            case 39:
                if ($(event.target).next().attr("data-index")) {
                    this.currentIndex++;
                    $("#" + this.rowId).find(">div[data-index=" + this.currentIndex + "]").focus();
                } else {
                    if (this.input) {
                        this.input.focus();
                    } else {
                        this.myInput.focus();
                    }
                    this.firstTabChip = true;
                }
                break;
            case 37:
                if (!this.state.inputValue) {//文本输入框为空,按左键则向前面的标签切换
                    if (this.firstTabChip) {
                        if (this.input) {
                            this.input.blur();
                        } else {
                            this.myInput.blur();
                        }
                        this.firstTabChip = false;
                        this.currentIndex = this.props.data.length - 1;
                    } else {
                        if (this.currentIndex > 0) {
                            this.currentIndex--;
                        } else {
                            this.currentIndex = 0;
                        }
                    }
                    $("#" + this.rowId).find(">div[data-index=" + this.currentIndex + "]").focus();
                }
                break;
            case 46://按delete
                if (!this.state.inputValue) {
                    if (this.firstTabChip) {//文本框处于聚焦的时候
                        if (this.props.data.length >= 1) {
                            let deleteTagName = this.props.data[this.props.data.length - 1].stockTag.tag;//依次删除最后一个标签
                            this.deleteTag(deleteTagName);
                            setTimeout(() => {
                                if (this.input) {
                                    this.input.focus();
                                }
                            }, 200);
                        }
                    } else {//当tag处于选择模式的时候
                        let deleteTagName = this.props.data[this.currentIndex].stockTag.tag;
                        this.deleteTag(deleteTagName);
                        this.currentIndex++;
                        $("#" + this.rowId).find(">div[data-index=" + this.currentIndex + "]").focus();//删除当前标签后，聚焦后一个标签
                        this.currentIndex--;//取数据的序号index不变，但聚焦的index会加1

                    }
                }
                break;
            case 8://按Backspace
                if (!this.state.inputValue) {
                    if (this.firstTabChip) {//文本框处于聚焦的时候
                        if (this.props.data.length >= 1) {
                            let deleteTagName = this.props.data[this.props.data.length - 1].stockTag.tag;//依次删除最后一个标签
                            this.deleteTag(deleteTagName);
                            setTimeout(() => {
                                if (this.input) {
                                    this.input.focus();
                                }
                            }, 200);
                        }
                    } else {//当tag处于选择模式的时候
                        this.currentIndex--;//聚焦的index减1，删除的交互逻辑chip组件已经拥有
                        $("#" + this.rowId).find(">div[data-index=" + this.currentIndex + "]").focus();//删除当前标签后，聚焦后一个标签
                    }
                }

        }
    }

    saveInputRef = input => this.input = input;
    styles = {
        container: {
            display: "flex",
            flexWrap: "wrap"
        },
        chipMargin: {
            margin: "5px",
            height: 32,
            padding: 0
        },
        onlyKeyInput: {
            border: "none",
            outline: "none",
            fontSize: "16px",
            backgroundColor: "transparent",
        },
        textInput:{
            fontSize:14
        }
    };

    render() {
        const tagsLength = this.props.data.length;
        let inputShow = true;//是否显示文本输入控件
        let onlyKeyInput = false;//是否显示幽灵文本框，只显示光标，不可输入文本
        if (tagsLength >= 5) {
            inputShow = false;
            onlyKeyInput = true;
            this.myInputTab = true;
        }
        this.rowId = "rowId" + this.props.inputId;
        return (<div style={this.styles.container as any} onKeyDown={this.keyHandle.bind(this)} id={this.rowId}>
            {this.props.data.map((ele, index) => {
                return (
                    <Chip
                        key={ele.stockTag.id}
                        style={this.styles.chipMargin}
                        labelStyle={{fontSize: 12}}
                        onRequestDelete={() => {
                            this.deleteTag(ele.stockTag.tag)
                        }}
                        onTouchTap={
                            (event) => {
                                // console.log($(event.target).parent().attr("data-index"))
                                this.currentIndex = $(event.target).parent().attr("data-index");
                                this.firstTabChip = false;
                            }
                        }
                        tabIndex={-1}
                        data-index={index}
                        role="tagDetail"
                        className="custom-tag"
                    >
                        {ele.stockTag.tag}
                    </Chip>
                );
            })}
            {inputShow && <AutoComplete
                ref={this.saveInputRef}
                id={this.props.inputId + ""}
                filter={AutoComplete.noFilter}
                openOnFocus={!this.props.small}
                dataSource={this.props.small?[]:this.props.tags}
                onUpdateInput={this.handleInputChange.bind(this)}
                onNewRequest={(chosenRequest) => {
                    this.handleInputConfirm(chosenRequest);
                }}
                onClose={() => {
                    this.handleInputConfirm(this.state.inputValue)
                }}
                role="tagInputBox"
                hintText="请输入新标签"
                maxLength={10}
                style={{width: "150px"}}
                fullWidth={true}
                onFocus={() => {
                    this.currentIndex = this.props.data.length - 1;
                    this.firstTabChip = true;//文本框聚焦，切换状态为true
                    stockAttentionDataSource.requestTags();
                }}
                searchText={this.state.inputValue}
                textFieldStyle={this.styles.textInput}
            />}
            {
                onlyKeyInput &&
                <input type="text" autoFocus={true} maxLength={0} style={this.styles.onlyKeyInput} ref={(input) => {
                    this.myInput = input
                }}/>
            }
        </div>)
    }
}