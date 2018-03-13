import * as React from "react";
let nodeColor = {
    ANALYST: '#1984c7',//蓝色
    BROKERAGE: '#c79f19',//橙色
    STOCK: '#eb4a4a',//红色
    SUBJECT: '#a642e5',//紫色
    INDUSTRY: '#88b14b'//绿色
};//节点类型对应颜色

class GraphViewProps {
    identifier: string;
    name: string;
    type: string;
}
/*


@observer
export default class GraphView extends React.Component<GraphViewProps, null> {
    styles={
        controlPanel:{
            padding: "15px",
            width: "260px",
            position:"relative",
            zIndex:999
        },
        graphPosition:{
            left:"0",
            top:"-210px",
            zIndex:1
        }
    };
    componentDidMount() {
        this.graphChart = echarts.init(this.chartDiv);
        this.dataSource.identifier = this.props.identifier;
        this.dataSource.name = this.props.name;
        this.graphRefresh();//页面初次加载图谱
        this.windowResizeHandler = e => this.graphChart.resize();
        window.addEventListener("resize", this.windowResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.windowResizeHandler);
    }

    graphRefresh() {
        this.dataSource.refresh(() => {
            let option = {
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        force: {
                            edgeLength: 250, repulsion: 150
                        },
                        data: this.dataSource.$.nodes.map(function (node) {

                            return {
                                id: node.identifier,
                                name: node.text,
                                symbolSize: 50 - node.depth * 20,
                                itemStyle: {
                                    normal: {
                                        color: nodeColor[node.type]
                                    },
                                    emphasis: {
                                        color: nodeColor[node.type]
                                    }
                                }
                            };
                        }),
                        edges: this.dataSource.$.edges.map(
                            edge => {
                                return {
                                    source: this.dataSource.$.nodes[edge.startIndex].identifier + "",
                                    target: this.dataSource.$.nodes[edge.endIndex].identifier + ""
                                };
                            }
                        ),
                        label: {
                            normal: {
                                position: 'bottom',
                                show: true
                            },
                            emphasis: {
                                position: 'bottom',
                                show: true
                            }
                        },
                        roam: true,
                        focusNodeAdjacency: true,
                        draggable: true
                    }
                ]
            };
            this.graphChart.setOption(option);
        });
    }

    render() {
        return (
            <div>
                <Paper style={this.styles.controlPanel}>
                    <ControlPanel graphRefresh={this.graphRefresh.bind(this)} type={this.props.type}/>
                </Paper>
                <div style={this.styles.graphPosition} className="keep-aspect-ratio aspect-3-of-4">
                    <div ref={element => {
                        this.chartDiv = element;
                    }} className="aspect-target"/>
                </div>
            </div>
        );
    }

    private graphChart;
    private chartDiv: HTMLDivElement;
    private windowResizeHandler: (e: Event) => void;

    private get dataSource(): GraphDataSource {
        return this.props.type === "analyst" ? analystGraphDataSource : stockGraphDataSource;
    }
}
    */