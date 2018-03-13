import * as React from "react";
class ControlPanelProp {
    graphRefresh;
    type: string;
}

/*
@observer
export default class ControlPanel extends React.Component<ControlPanelProp, null> {

    @observable private analystChecked: boolean = true;
    @observable private industryChecked: boolean = true;
    @observable private brokerageChecked: boolean = true;
    @observable private subjectChecked: boolean = true;
    @observable private stockChecked: boolean = true;

    render() {
        return (
            <div style={{fontSize:"14px"}}>
                <SelectField
                    value={this.dataSource.timeWindow.toString()}
                    onChange={(e, k, v) => {
                        this.timeWindowChange(v);
                    }}
                    disabled={this.dataSource.loading}
                    fullWidth={true}
                    style={{fontSize:"14px"}}
                >
                    <MenuItem value={new TimeWindow(3, TimeWindowUnit.Month).toString()} primaryText="最近三月"/>
                    <MenuItem value={new TimeWindow(1, TimeWindowUnit.Year).toString()} primaryText="最近一年"/>
                    <MenuItem value={new TimeWindow(3, TimeWindowUnit.Year).toString()} primaryText="最近三年"/>
                </SelectField>
                <Checkbox
                    label="证券分析师"
                    checked={this.analystChecked}
                    onCheck={(e, checked) => {
                        this.analystChecked = checked;
                        if (checked) {
                            this.dataSource.nodeTypes.add("ANALYST");
                            this.props.graphRefresh();
                        } else {
                            this.dataSource.nodeTypes.delete("ANALYST");
                            this.props.graphRefresh();
                        }
                    }}
                    disabled={this.props.type === "analyst"}
                />
                <Checkbox
                    label="行业板块"
                    checked={this.industryChecked}
                    onCheck={(e, checked) => {
                        this.industryChecked = checked;
                        if (checked) {
                            this.dataSource.nodeTypes.add("INDUSTRY");
                            this.props.graphRefresh();
                        } else {
                            this.dataSource.nodeTypes.delete("INDUSTRY");
                            this.props.graphRefresh();
                        }
                    }}
                />
                <Checkbox
                    label="券商研究所"
                    checked={this.brokerageChecked}
                    onCheck={(e, checked) => {
                        this.brokerageChecked = checked;
                        if (checked) {
                            this.dataSource.nodeTypes.add("BROKERAGE");
                            this.props.graphRefresh();
                        } else {
                            this.dataSource.nodeTypes.delete("BROKERAGE");
                            this.props.graphRefresh();
                        }
                    }}
                />
                <Checkbox
                    label="题材概念"
                    checked={this.subjectChecked}
                    onCheck={(e, checked) => {
                        this.subjectChecked = checked;
                        if (checked) {
                            this.dataSource.nodeTypes.add("SUBJECT");
                            this.props.graphRefresh();
                        } else {
                            this.dataSource.nodeTypes.delete("SUBJECT");
                            this.props.graphRefresh();
                        }
                    }}
                />
                <Checkbox
                    label="上市公司"
                    disabled={this.props.type === "stock"}
                    checked={this.stockChecked}
                    onCheck={(e, checked) => {
                        this.stockChecked = checked;
                        if (checked) {
                            this.dataSource.nodeTypes.add("STOCK");
                            this.props.graphRefresh();
                        } else {
                            this.dataSource.nodeTypes.delete("STOCK");
                            this.props.graphRefresh();
                        }
                    }}
                />
            </div>
        );
    }

    private timeWindowChange(value: string): void {
        this.dataSource.timeWindow = TimeWindow.fromString(value);
        this.props.graphRefresh();
    }

    private get dataSource(): GraphDataSource {
        return this.props.type === "analyst" ? analystGraphDataSource : stockGraphDataSource;
    }

}
 */
