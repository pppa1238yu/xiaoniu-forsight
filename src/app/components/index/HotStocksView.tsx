import * as React from "react";
import {observer} from "mobx-react";
import {List, ListItem} from "material-ui/List";
import {green500, grey500, pinkA200, red500, transparent} from "material-ui/styles/colors";
import ExpandableList from "../common/ExpandableList";
import {observable} from "mobx";
import {http} from "../../model/ajax/Http";
import {Objects} from "../../model/Objects";
import {HotStocks} from "../../model/entities/HotStocks";
import {Link} from "react-router-dom";
import Avatar from "material-ui/Avatar";
import Constants from "../../Constants";
let RightChange = (props) => {
    let styles={
        incrementText:{
            position: "absolute",
            right: "36px",
            color:red500
        },
        decrementText:{
            position: "absolute",
            right: "36px",
            color:green500
        },
        text:{
            position: "absolute",
            right: "36px",
            color:grey500
        }
    };
    let data=props.data.toFixed(2)+"%";
    if(props.data>0){
        return <span style={styles.incrementText as any}>+{data}</span>
    }else if(props.data<0){
        return <span style={styles.decrementText as any}>{data}</span>
    }else {
        return <span style={styles.text as any}>{data}</span>
    }
};
@observer
export default class HotStocksView extends React.Component<any, any> {
    @observable private readonly data: Array<HotStocks> = [];
    constructor(props, context){
        super(props, context);
        this.refresh();
    }
    styles = {
        innerStyle: {
            padding:'27px  56px 27px 90px',
            fontSize:16,
            color:'#616161'
        },
        imgStyle: {
            top:14
        },
        listItem: {
            padding:'0 10px'
        }
    };
    render() {
        let content = null;
        let imgUrl =" ";
        if(this.data.length){
            content = (
                this.data.map((item,index)=>{
                    imgUrl = item.imageUrl ? Constants.imageBaseUrl +item.imageUrl:Constants.noDataHeadImg;
                    return <ListItem
                        key={item.stockCode}
                        innerDivStyle = {this.styles.innerStyle}
                        primaryText={item.shortName}
                        style={this.styles.listItem}
                        leftAvatar={<Avatar style={this.styles.imgStyle} src={imgUrl}/>}
                        rightIcon={<RightChange data={item.changeRatio}/>}
                        onTouchTap={
                            ()=>{

                            }
                        }
                        containerElement={<Link role="linktoStockDetailPage" to={"/stock/detail/"+item.stockCode}/>}
                    />
                })
            );
        }else {
            content=<p style={{textAlign:"center"}}>暂无数据</p>
        }
        return (
            <ExpandableList needMore
                            initialOpen={this.props.initialOpen}
                            disableExpandable={this.props.disableExpandable}
                            moreLabel="更多"
                            onMoreClicked={
                                (event) => {

                                }
                            }
                            linkMore="/stock"
                            title="热门股票"
                            content={content}/>
        )
    }
    private refresh() {
        http.post(
            '/stock/hotStocks', {}
        ).then((data) => {
            Objects.assign(this.data, data);
        });
    }
}