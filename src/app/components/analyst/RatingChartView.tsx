import * as React from "react";
import * as echarts from "echarts";
import {grey700,red700,lightGreen500} from "material-ui/styles/colors";
export default class AnalystRatingView extends React.Component<any, any> {
    componentDidMount() {
        let chart = echarts.init(this.chartDiv);
        let ringColor=this.props.ringColor?red700:lightGreen500;
        let option = {
            series: [
                {
                    name:'个股评级',
                    type:'pie',
                    radius: ['98%', '100%'],
                    hoverAnimation:false,
                    labelLine:{
                        normal:{
                            show:false
                        }
                    },
                    label:{
                        normal:{
                            show:false,
                            position: 'center',
                            formatter:'{c}\n{b}'
                        }
                    },
                    color:[ringColor,"#ccc"],
                    data:[
                        {value:this.props.value, name:'5日上涨概率'},
                        {value:100-this.props.value,name:""}
                    ]
                }
            ]
        };
        chart.setOption(option);
        this.windowResizeHandler = e => chart.resize();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    private chartDiv: HTMLDivElement;

    private windowResizeHandler: (e: Event) => void;

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.windowResizeHandler);
    }
    render() {
        return (<div ref={(e)=>{this.chartDiv=e}} style={{width:"150px",height:"120px"}}>

        </div>)
    }
}