import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {List, ListItem} from "material-ui/List";
import {pinkA200, transparent} from "material-ui/styles/colors";
import Avatar from "material-ui/Avatar";
import ExpandableList from "../common/ExpandableList";
import {http} from "../../model/ajax/Http";
import {HotAnalystsData} from "../../model/entities/HotAnalystsData";
import {Link} from "react-router-dom";
import Constants from "../../Constants";
import Rate from "../../components/rate/Rate";
@observer
export default class HotAnalystView extends React.Component<any, any> {
    @observable private doUpdata:boolean =  false;
    private  data: Array<HotAnalystsData> = [];

    styles = {
        innerStyle: {
            padding:'17px  56px 17px 90px',
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

    constructor(props, context) {
        super(props, context);
        this.refresh();
    }

    render() {
        let content=null;
        let imgUrl="";
        if(this.doUpdata){
            if(this.data.length){
                content = (
                    this.data.map((ele) => {
                        imgUrl=ele.target.imageId ? Constants.imageBaseUrl + ele.target.imageId:Constants.noDataHeadImg;
                        return <ListItem
                            key={ele.target.gtaId}
                            primaryText={ele.target.fullName}
                            innerDivStyle = {this.styles.innerStyle}
                            secondaryText={(ele.target.title && ele.target.title.typeName) || "证券分析师"}
                            leftAvatar={<Avatar style={this.styles.imgStyle} src={imgUrl}/>}
                            rightIcon={<Rate score={ele.target.score}/>}
                            style={this.styles.listItem}
                            onTouchTap={
                                ()=>{
                                }
                            }
                            containerElement={<Link role="linktoAnalystDetailPage" to={"/analyst/detail/"+ele.target.gtaId} />}
                        />
                    })
                );
            }else {
                content=<p style={{textAlign:"center"}}>暂无数据</p>;
            }
        }else {
            content = null;
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
                            linkMore="/analyst"
                            title="热门分析师"
                            content={content}/>

        );
    }

    private refresh() {
        http.post(
            '/analyst/hotAnalysts', {}
        ).then((data) => {
            this.data = data;
            this.doUpdata = true;
        });
    }
}