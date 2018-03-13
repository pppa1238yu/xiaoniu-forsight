import * as React from "react";

import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import Menu from "material-ui/Menu";
import {List, ListItem} from "material-ui/List";
import Checkbox from "material-ui/Checkbox";

import Popover, {PopoverAnimationVertical} from "material-ui/Popover";
import Down from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import Right from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import Check from "material-ui/svg-icons/toggle/check-box";
import PartCheck from "material-ui/svg-icons/toggle/indeterminate-check-box";
import Done from "material-ui/svg-icons/action/done";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import {pinkA200, transparent} from "material-ui/styles/colors";
import * as ReactDOM from "react-dom";
import {red500, green500} from "material-ui/styles/colors";
import Chip from 'material-ui/Chip';
enum FilterType {
    Single,
    SingleWithHeader,
    Multi,
    Single4M,
    SingleWithHeader4M,
    Multi4M,
}

interface ValueChangeEvent {
    queryName: string;
    values: Array<any>;
    origin: Array<any>;
}
interface FilterProps {
    multi: boolean;
    filterData: object;
    values: Array<object>;
    onValuesChange: (ValueChangeEvent) => void;
    onTimeChange?: (Date) => void;
    mobile?: boolean;
    single?: boolean;
}

//NOTICE 顺序性
export default class Filter extends React.Component<FilterProps, any> {

    checkFilterType(filterData) {
        const firstItems = filterData['items'];

        let second = false;
        let header = false;
        for (let item of firstItems) {
            if (item['items']) {
                second = true;
                if (item['queryAble'] == false) {
                    header = true;
                }
            }
        }

        if (second && header) {
            return this.props.mobile ?
                FilterType.SingleWithHeader4M : FilterType.SingleWithHeader;
        } else if (second) {
            return this.props.mobile ?
                FilterType.Multi4M : FilterType.Multi;
        } else {
            return this.props.mobile ?
                FilterType.Single4M : FilterType.Single;
        }
    }

    render() {
        const {filterData} = this.props;
        let filter;
        switch (this.checkFilterType(filterData)) {
            case FilterType.Multi:
                filter = <MultiFilter {...this.props} />;
                break;
            case FilterType.Multi4M:
                filter = <MultiFilter4M {...this.props} />;
                break;
            case FilterType.SingleWithHeader:
                filter = <SingleFilterWithHeader {...this.props} />;
                break;
            case FilterType.SingleWithHeader4M:
                filter = <SingleFilterWithHeader4M {...this.props} />;
                break;
            case FilterType.Single4M:
                filter = <SingleFilter4M {...this.props} />;
                break;
            default:
                filter = <SingleFilter {...this.props} />;
                break;
        }
        return (
            <div>
                {filter}
            </div>
        );
    }
}

class SingleFilter extends React.Component<FilterProps, any> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            values: (this.props.values
            && this.props.values[this.props.filterData['queryName']])
            || [],
            open: false,
            focus: -1,
        };
    }

    styles = {
        text: {
            fontSize: 16,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'inline-block',
            maxWidth: 220,
        },
        clearColor: {
            color: null,
        },
        filterText: {
            fontSize: 12,
            color: null,
            padding: "0 16px 0 38px"
        },
        selectedText: {
            fontSize: 12,
            color: red500,
            padding: "0 16px 0 38px"
        },
        chipLabel:{
            fontSize:12
        },
        chipOpacity:{
            backgroundColor:"rgba(224,224,224,.6)"
        },

        deleteIcon:{
            width:"12px",
            height:"12px",
        }
    };

    notifyValuesChange = (values: Array<any>) => {
        if (this.props.onValuesChange) {
            this.props.onValuesChange(
                {
                    queryName: this.props.filterData['queryName'],
                    values: this.fetchValues(values),
                    origin: values,
                }
            );

        }
    };

    /*
     componentWillReceiveProps(props) {
     }
     */

    fetchValues(values) {
        return values.map(
            ele => this.props.filterData['items'][ele]['value']
        )
    }

    openMenu = (event) => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    itemClicked = (event, index, prevent = true) => {
        if (prevent) {
            event.preventDefault();
        }

        if (index == -1) {
            this.setState(
                {
                    values: [],
                    focus: 0,
                }
            );
            this.notifyValuesChange([]);
            this.handleRequestClose();
            return;
        }
        /*
         if (!this.props.multi) {
         this.setState(
         (preState) => {
         if (preState.values.includes(index)) {
         return {
         values: [],
         focus: index,
         };
         } else {
         return {
         values: [index],
         focus: index,
         };
         }
         }
         );
         this.handleRequestClose();
         } else {
         */
        this.setState(
            (preState) => {
                if (preState.values.includes(index)) {
                    const i = preState.values.indexOf(index);
                    const newValues = preState.values.slice();
                    newValues.splice(i, 1);

                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                        focus: index,
                    };
                } else {
                    let newValues = preState.values.slice();
                    if (this.props.single) {
                        newValues = [];
                    }
                    newValues.push(index);
                    this.notifyValuesChange(newValues);
                    if (this.props.single) {
                        return {
                            values: newValues,
                            focus: index,
                            open: false
                        };
                    } else {
                        return {
                            values: newValues,
                            focus: index,
                        };
                    }
                }
            }
        )
    };

    handleRequestClose = (e?) => {
        if (this.props.mobile) {
            return;
        }
        this.setState({
            open: false,
        });
    };

    selectionRenderer = (values, name, items) => {
        if (values && values.length > 0) {
            let str = '';
            let first = true;
            for (let value of values) {
                const s = items[value]['labelName'];
                if (first) {
                    str = s;
                    first = false;
                } else {
                    str = str + ', ' + s;
                }
            }
            return name + ': ' + str;
        } else {
            return name;
        }
    };

    render() {
        const dataItem = this.props.filterData['items'] as Array<any>;
        const items = dataItem.map(
            (ele, index) => {
                return (
                    <MenuItem
                        key={index}
                        value={index}
                        primaryText={ele['labelName']}
                        insetChildren
                        onTouchTap={
                            (event) => this.itemClicked(event, index)}
                        leftIcon={this.state.values.includes(index) ?
                            <Done style={{width: "14px", height: "14px", margin: "4px", left: "18px"}}
                                  color={red500}/> : null}
                        innerDivStyle={this.state.values.includes(index) ? this.styles.selectedText : this.styles.filterText}
                    />
                );
            }
        );

        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.props.filterData['items']);
        let selectedItems = label.split(":")[1] ? label.split(":")[1].split(",") : [];//生成选中项目标签的数组
        return (
            <div>
                <FlatButton label={label}
                            labelStyle={this.styles.text}
                            labelPosition="before"
                            icon={<Down />}
                            onTouchTap={this.openMenu} title={label}/>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        desktop
                        maxHeight={300}
                        value={this.state.focus}
                        selectedMenuItemStyle={this.styles.clearColor}
                    >
                        <MenuItem primaryText="所有"
                                  value={-1}
                                  insetChildren
                                  onTouchTap={
                                      this.state.values.length == 0 ?
                                          (event) => {
                                              event.preventDefault();
                                          } :
                                          (event) => this.itemClicked(event, -1)
                                  }
                                  key={-1}
                                  leftIcon={this.state.values.length == 0 ?
                                      <Done style={{width: "14px", height: "14px", margin: "4px", left: "18px"}}
                                            color={red500}/> : null}
                                  innerDivStyle={this.state.values.length == 0 ? this.styles.selectedText : this.styles.filterText}
                        />
                        <Divider inset key={-2}/>
                        {items}
                    </Menu>
                </Popover>
                {/*<div className="flex-start selected-tag-box1">
                    {selectedItems.map((ele, index) => {
                        return <Chip key={ele} labelStyle={this.styles.chipLabel} style={this.styles.chipOpacity} onRequestDelete={(event) => {
                            this.itemClicked(event, this.state.values[index]);
                        }}>
                            {ele}
                        </Chip>
                    })}
                </div>*/}
            </div>
        );
    }
}

class SingleFilter4M extends SingleFilter {

    constructor(props, context) {
        super(props, context);
    }

    parentClicked = () => {
        this.setState(
            (preState) => {
                const items = this.props.filterData['items'];
                if (preState.values.length == items.length) {
                    this.notifyValuesChange([]);
                    return {
                        values: [],
                    }
                } else if (preState.values.length == 0) {
                    const newValues = items.map(
                        (ele, index) => index
                    );
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                    }
                } else {
                    this.notifyValuesChange([]);
                    return {
                        values: [],
                    }
                }
            }
        )
    };

    render() {
        const dataItem = this.props.filterData['items'] as Array<any>;
        const items = dataItem.map(
            (ele, index) => {
                return (
                    <ListItem
                        key={index}
                        primaryText={ele['labelName']}
                        leftCheckbox={<Checkbox
                            onCheck={
                                (event) => {
                                    this.itemClicked(event, index, false)
                                }
                            }
                            checked={this.state.values.includes(index)}
                        />}
                    />
                );
            }
        );

        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.props.filterData['items']);
        return (
            <ListItem primaryText={
                <span style={this.styles.text as any} className="ellipsis-no-hover">{label}</span>
            }
                      nestedItems={
                          items
                      }
                      leftIcon={<Checkbox
                          checkedIcon={
                              dataItem.length == this.state.values.length ?
                                  <Check /> : <PartCheck/>
                          }
                          checked={this.state.values.length > 0}
                          disabled={this.state.values.length == 0}
                      />}
                      onTouchTap={
                          this.state.values.length == 0 ?
                              (event) => {
                                  event.stopPropagation();
                              } :
                              (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  this.parentClicked();
                              }
                      }
            />
        );
    }
}

class SingleFilterWithHeader extends SingleFilter {

    constructor(props, context) {
        super(props, context);

        this.initItems(this.props.filterData);
    }

    items = [];

    fetchValues(values) {
        return values.map(
            ele => this.items[ele]['value']
        )
    }

    initItems(filterData) {
        this.items = [];
        for (let item of filterData['items']) {
            const key = item['labelName'];
            for (let value of item['items']) {
                value["key"] = key;
            }
            this.items.push(...item['items']);
            //this.items[key] =  item['items'];
        }
    }

    /*
     componentWillReceiveProps(nextProps) {
     this.initItems(nextProps.filterData) ;
     }
     */

    render() {
        let last = null;
        let items = [];
        let index = 0;
        for (let item of this.items) {
            if (last == null || last != item['key']) {
                last = item['key'];
                items.push(<Divider key={"02" + (-index)} inset/>);
                items.push(<MenuItem key={"01" + (-index)}
                                     value={"01" + (-index)}
                                     insetChildren
                                     primaryText={last}
                                     innerDivStyle={{padding: "0 16px 0 38px"}}
                                     style={this.styles.filterText}
                />);
            }
            const cur = index;
            items.push(<MenuItem
                key={index}
                value={index}
                primaryText={item['labelName']}
                insetChildren
                onTouchTap={
                    (event) => this.itemClicked(event, cur)}
                leftIcon={this.state.values.includes(index) ?
                    <Done style={{width: "14px", height: "14px", margin: "17px"}} color={red500}/> : null}
                innerDivStyle={this.state.values.includes(index) ? this.styles.selectedText : this.styles.filterText}
            />);
            index = index + 1;
        }
        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.items);
        let selectedItems = label.split(":")[1] ? label.split(":")[1].split(",") : [];//生成选中项目标签的数组

        return (
            <div>
                <FlatButton label={label}
                            labelStyle={this.styles.text}
                            labelPosition="before"
                            icon={<Down />}
                            onTouchTap={this.openMenu} title={label}/>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        value={this.state.focus}
                        selectedMenuItemStyle={this.styles.clearColor}
                        maxHeight={500}
                        id="letter-filter"
                    >
                        <MenuItem primaryText="所有"
                                  insetChildren
                                  onTouchTap={
                                      this.state.values.length == 0 ?
                                          (event) => {
                                              event.preventDefault();
                                          } :
                                          (event) => this.itemClicked(event, -1)
                                  }
                                  key={-1}
                                  value={-1}
                                  innerDivStyle={this.state.values.length == 0 ? this.styles.selectedText : this.styles.filterText}
                                  leftIcon={this.state.values.length == 0 ?
                                      <Done style={{width: "14px", height: "14px", margin: "17px"}}
                                            color={red500}/> : null}
                        />
                        {items}
                    </Menu>
                </Popover>
                {/*<div className="flex-start selected-tag-box">
                    {selectedItems.map((ele, index) => {
                        return <Chip key={ele} labelStyle={this.styles.chipLabel} style={this.styles.chipOpacity} onRequestDelete={(event) => {
                            this.itemClicked(event, this.state.values[index]);
                        }}>
                            {ele}
                        </Chip>
                    })}
                </div>*/}
            </div>
        );
    }
}

class SingleFilterWithHeader4M extends SingleFilterWithHeader {

    parentClicked = () => {
        this.setState(
            (preState) => {
                if (preState.values.length == this.items.length) {
                    this.notifyValuesChange([]);
                    return {
                        values: [],
                    }
                } else if (preState.values.length == 0) {
                    const newValues = this.items.map(
                        (ele, index) => index
                    );
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                    }
                } else {
                    this.notifyValuesChange([]);
                    return {
                        values: [],
                    }
                }
            }
        )
    };

    render() {
        let last = null;
        const items = [];
        let index = 0;
        for (let item of this.items) {
            let right = false;
            if (last == null || last != item['key']) {
                last = item['key'];
                right = true;
            }
            const cur = index;
            items.push(<ListItem
                key={index}
                primaryText={item['labelName']}
                rightAvatar={
                    right ?
                        <Avatar
                            color={pinkA200} backgroundColor={transparent}
                        >
                            {last}
                        </Avatar>
                        : null

                }
                leftCheckbox={<Checkbox
                    onCheck={
                        (event) => {
                            this.itemClicked(event, cur, false)
                        }
                    }
                    checked={this.state.values.includes(index)}
                />
                }/>);
            index = index + 1;
        }
        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.items);
        return (
            <ListItem primaryText={
                <span style={this.styles.text as any} className="ellipsis-no-hover">{label}</span>
            }
                      nestedItems={
                          items
                      }
                      leftIcon={<Checkbox
                          checkedIcon={
                              this.items.length == this.state.values.length ?
                                  <Check /> : <PartCheck/>
                          }
                          checked={this.state.values.length > 0}
                          disabled={this.state.values.length == 0}
                      />}
                      onTouchTap={
                          this.state.values.length == 0 ?
                              (event) => {
                                  event.stopPropagation();
                              } :
                              (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  this.parentClicked();
                              }
                      }
            />

        );
    }
}


class MultiFilter extends SingleFilter {

    constructor(props, context) {
        super(props, context);

        this.initItems(this.props.filterData);
    }

    fetchValues(values) {
        const result = [];
        for (let value of values) {
            if (this.items[value]['parent'] != undefined) {
                const parent = this.items[value]['parent'];
                const v = {};
                (parent);
                (this.items[parent]);
                v[this.items[parent]['queryName']] = this.items[parent]['value'];
                v[this.items[value]['queryName']] = this.items[value]['value'];
                result.push(v);
            } else {
                const v = {};
                v[this.items[value]['queryName']] = this.items[value]['value'];
                result.push(v);
            }
        }
        return result;
    }

    items = [];

    initItems(filterData) {
        this.items = [];
        let index = 0;
        for (let item of filterData['items']) {
            this.items.push(item);
            if (item['items'] && item['items'].length > 0) {
                item['left'] = index + 1;
                item['right'] = index + item['items'].length;
                for (let child of item['items']) {
                    child['parent'] = index;
                }
                this.items.push(...item['items']);
                index += (1 + item['items'].length);
            } else {
                index += 1;
            }
        }
    }

    /*
     componentWillReceiveProps(nextProps) {
     this.initItems(nextProps.filterData) ;
     }
     */

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    calcParentSelected(parent) {
        for (let index = parent; index <= this.items[parent]['right']; index++) {
            if (this.state.values.includes(index)) {
                return true;
            }
        }
        return false;
    }

    calcParent(cur) {
        if (cur < 0) {
            return {
                'parent': -1,
            }
        }
        if (this.items[cur]['parent'] != undefined) {
            return {
                'parent': this.items[cur]['parent'],
                'child': true,
            };
        } else {
            return {
                'parent': cur,
                'child': false,
            };
        }
    }

    childrenClick = (event, index, parent) => {
        event.preventDefault();

        /*
         if (!this.props.multi) {
         this.setState(
         (preState) => {
         if (preState.values.includes(index)) {
         return {
         values: [],
         focus: index,
         };
         } else {
         return {
         values: [index],
         focus: index,
         };
         }
         }
         );
         this.handleRequestClose();
         } else {
         */
        this.setState(
            (preState) => {
                if (preState.values.includes(index)) {
                    const i = preState.values.indexOf(index);
                    const newValues = preState.values.slice();
                    newValues.splice(i, 1);
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                        focus: index,
                    };
                } else {
                    const newValues = [index];
                    for (let i of preState.values) {
                        if (index == parent) {
                            if (i >= this.items[index]['left']
                                && i <= this.items[index]['right']) {
                                //ignore
                            } else {
                                newValues.push(i);
                            }
                        } else {
                            if (i == parent) {
                                //ignore
                            } else {
                                newValues.push(i);
                            }
                        }
                    }
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                        focus: index,
                    };
                }
            }
        )
        //}
    };

    render() {

        const focusParent = this.calcParent(this.state.focus);
        const items = [];
        for (let index = 0; index < this.items.length; index++) {
            const cur = index;
            const item = this.items[index];
            //const cur = index + 1;
            //const id = 'filter-' + this.props.filterData['queryName'] + cur;
            if (item['left']) {

                const children = [];

                children.push(
                    <MenuItem
                        key={index}
                        value={index}
                        primaryText="所有"
                        insetChildren

                        onTouchTap={
                            (event) => this.childrenClick(event, cur, cur)
                        }
                        leftIcon={this.state.values.includes(index) ?
                            <Done style={{width: "14px", height: "14px", margin: "16px", left: "3px"}}
                                  color={red500}/> : null}
                        innerDivStyle={this.state.values.includes(index) ? this.styles.selectedText : this.styles.filterText}
                    />
                );
                children.push(
                    <Divider inset key={-1}/>
                );
                const parent = index;
                for (index = index + 1; index <= item['right']; index++) {
                    const child = index;
                    children.push(
                        <MenuItem
                            key={index}
                            value={index}
                            primaryText={this.items[index]['labelName']}
                            insetChildren

                            onTouchTap={
                                (event) => this.childrenClick(event, child, parent)
                            }
                            leftIcon={this.state.values.includes(index) ?
                                <Done style={{width: "14px", height: "14px", margin: "16px", left: "3px"}}
                                      color={red500}/> : null}
                            innerDivStyle={this.state.values.includes(index) ? this.styles.selectedText : this.styles.filterText}
                        />
                    );
                }

                const focus = focusParent.parent == parent && this.state.focus;

                items.push(<CustomMenuItem
                    key={cur}
                    value={cur}
                    primaryText={item['labelName']}
                    insetChildren

                    focus={focus}
                    rightIcon={<Right />}
                    leftIcon={this.calcParentSelected(cur) ?
                        <Done style={{width: "14px", height: "14px", margin: "16px", left: "3px"}}
                              color={red500}/> : null}
                    innerDivStyle={this.calcParentSelected(cur) ? this.styles.selectedText : this.styles.filterText}
                >
                    {children}
                </CustomMenuItem>);
                //pops.push(popover);
                index -= 1;
            } else {
                items.push(<MenuItem
                    key={index}
                    value={index}
                    primaryText={item['labelName']}

                    insetChildren
                    onTouchTap={
                        (event) => this.itemClicked(event, cur)}
                    leftIcon={this.state.values.includes(index) ?
                        <Done style={{width: "14px", height: "14px", margin: "16px", left: "3px"}}
                              color={red500}/> : null}
                    innerDivStyle={this.state.values.includes(index) ? this.styles.selectedText : this.styles.filterText}
                />)
            }

        }
        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.items);
        return (
            <div>
                <FlatButton label={label}
                            labelStyle={this.styles.text}
                            labelPosition="before"
                            icon={<Down />}
                            onTouchTap={this.openMenu} title={label}/>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        maxHeight={500}
                        value={focusParent.parent}
                        selectedMenuItemStyle={this.styles.clearColor}
                    >
                        <MenuItem primaryText="所有"

                                  insetChildren
                                  onTouchTap={
                                      this.state.values.length == 0 ?
                                          (event) => {
                                              event.preventDefault();
                                          } :
                                          (event) => this.itemClicked(event, -1)
                                  }
                                  key={-1}
                                  value={-1}
                                  leftIcon={this.state.values.length == 0 ?
                                      <Done style={{width: "14px", height: "14px", margin: "16px", left: "3px"}}
                                            color={red500}/> : null}
                                  innerDivStyle={this.state.values.length == 0 ? this.styles.selectedText : this.styles.filterText}

                        />
                        <Divider inset key={-2}/>
                        {items}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

class CustomMenuItem extends React.Component<any, any> {
    styles = {
        clearColor: {
            color: null,
        }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            anchorEl: null,
        };
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
            anchorEl: null,
        });
    };

    openMenu = (event) => {
        event.preventDefault();

        (ReactDOM.findDOMNode(this));
        this.setState({
            open: true,
            anchorEl: ReactDOM.findDOMNode(this),
        });
    };


    render() {
        const {
            children,
            focus,
            ...other
        } = this.props;

        const popover = (
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
            >
                <Menu
                    maxHeight={500}
                    value={focus}
                    selectedMenuItemStyle={this.styles.clearColor}
                >
                    {children}
                </Menu>
            </Popover>
        );
        return (
            <MenuItem
                onTouchTap={
                    this.openMenu
                }
                {...other}
            >
                {popover}
            </MenuItem>
        );

    }
}

class MultiFilter4M extends MultiFilter {

    parentClicked = () => {
        this.notifyValuesChange([]);
        this.setState(
            {
                values: [],
            }
        )
    };

    subParentClicked = (parent) => {
        this.setState(
            (preState) => {
                if (this.includeOne(parent, preState.values)) {
                    const newValues = [];
                    for (let i of preState.values) {
                        if (i >= parent
                            && i <= this.items[parent]['right']) {
                            //ignore
                        } else {
                            newValues.push(i);
                        }
                    }
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                    };
                } else {
                    const newValues = preState.values.slice();
                    newValues.push(parent);
                    this.notifyValuesChange(newValues);
                    return {
                        values: newValues,
                    };
                }
            }
        )
    };

    all() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]['left']) {
                if (!this.includeAll(i, this.state.values)) {
                    return false;
                }
                i = this.items[i]['right'];
            } else {
                if (!this.state.values.includes(i)) {
                    return false;
                }
            }
        }
        return true;
    }

    includeOne(parent, values) {
        if (values.includes(parent)) {
            return true;
        }
        for (let i = this.items[parent]['left']; i < this.items[parent]['right']; i++) {
            if (values.includes(i)) {
                return true;
            }
        }
        return false;
    }

    includeAll(parent, values) {
        if (values.includes(parent)) {
            return true;
        }
        for (let i = this.items[parent]['left']; i < this.items[parent]['right']; i++) {
            if (!values.includes(i)) {
                return false;
            }
        }
        return true;
    }

    render() {
        const items = [];
        for (let index = 0; index < this.items.length; index++) {
            const cur = index;
            const item = this.items[index];
            //const cur = index + 1;
            //const id = 'filter-' + this.props.filterData['queryName'] + cur;
            if (item['left']) {

                const children = [];

                const parent = index;
                for (index = index + 1; index <= item['right']; index++) {
                    const child = index;
                    children.push(
                        <ListItem
                            key={index}
                            primaryText={this.items[index]['labelName']}
                            leftCheckbox={<Checkbox
                                onCheck={
                                    (event) => {
                                        this.childrenClick(event, child, parent);
                                    }
                                }
                                checked={
                                    this.state.values.includes(index)
                                }
                            />
                            }
                        />
                    );
                }

                items.push(
                    <ListItem
                        key={cur}
                        primaryText={item['labelName']}
                        nestedItems={
                            children
                        }
                        leftIcon={<Checkbox
                            checkedIcon={
                                this.includeAll(cur, this.state.values) ?
                                    <Check /> : <PartCheck/>
                            }
                            checked={this.includeOne(cur, this.state.values)}
                            onCheck={
                                () => {
                                    this.subParentClicked(cur)
                                }
                            }
                        />}
                        onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.subParentClicked(cur)
                            }
                        }
                    />
                );
                index -= 1;
            } else {
                items.push(<ListItem
                    key={index}
                    primaryText={item['labelName']}
                    leftCheckbox={<Checkbox
                        onCheck={
                            (event) => {
                                this.itemClicked(event, cur, false)
                            }
                        }
                        checked={this.state.values.includes(index)}
                    />
                    }/>
                );
            }

        }
        const label = this.selectionRenderer(this.state.values,
            this.props.filterData['labelName'],
            this.items);
        return (

            <ListItem primaryText={
                <span style={this.styles.text as any} className="ellipsis-no-hover">{label}</span>
            }
                      nestedItems={
                          items
                      }

                      leftIcon={<Checkbox
                          checkedIcon={
                              this.all() ?
                                  <Check /> : <PartCheck/>
                          }
                          checked={this.state.values.length > 0}
                          disabled={this.state.values.length == 0}
                      />}

                      onTouchTap={
                          this.state.values.length == 0 ?
                              (event) => {
                                  event.stopPropagation();
                              } :
                              (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  this.parentClicked();
                              }
                      }
            />
        );
    }
}
