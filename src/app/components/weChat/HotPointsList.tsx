import * as React from "react";
import {hotPointsDataSource} from "../../model/ajax/HotPointsService";

declare let $;
declare let jQCloud;

interface HotPointsListProps {
    notifyResult: (err) => void
}
export default class HotPointsList extends React.Component<HotPointsListProps, any> {
    styles = {
        hotRank: {
            color: "#666",
            fontSize: 14,
            padding:"10px 0"
        },
        rankNumber:{
            marginLeft:"20px",
            color:"#fd0132",
            fontSize: 14
        }
    };
    componentDidMount() {
        hotPointsDataSource.setNotifyResult(this.props.notifyResult);
        hotPointsDataSource.reset();
        hotPointsDataSource.request(() => {

        });
    }
    componentDidUpdate(){
        hotPointsDataSource.$.slice(0,5).map((e,index)=>{
            let everyHotBox=e.map((value,subIndex)=>{
                return {
                    text:value,
                    weight:5-subIndex
                }
            });
            $("#hotWordsContent .nav-cloud:eq("+index+")").jQCloud(everyHotBox);
        });
    }
    render() {

        return (
            <div id="hotWordsContent">
                {hotPointsDataSource.$.length ? hotPointsDataSource.$.slice(0,5).map((e,index)=>{
                    return (
                        <div key={index}>
                            <div style={this.styles.hotRank}><span>热度排序:</span><span style={this.styles.rankNumber}>{index+1}</span></div>
                            <div className="nav-cloud">
                            </div>
                        </div>
                    )
                }) : null}
            </div>
        )
    }
}