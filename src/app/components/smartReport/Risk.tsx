import * as React from "react";
import {getRiskDataSource} from "../../model/ajax/SmartReportService";
import If from "../../components/common/If";
import Explain from "../common/Explain";

export default class Risk extends React.Component<any, null> {

    componentWillUnmount() {
        getRiskDataSource.setMount(false);
    }

    componentWillMount() {
        getRiskDataSource.setMount(true);
    }

    componentDidMount() {
        getRiskDataSource.setNotifyResult(this.props.notifyResultRisk);
        getRiskDataSource.resetWithId(this.props.symbol);
        getRiskDataSource.request();
    }

    styles = {
        padding: {
            padding: '30px'
        },
        leftPadding: {
            paddingLeft: 60
        }
    };
    private explainText = [
        "Beta系数：衡量个别股票相对于总体市场的价格波动情况，可以评估证券的系统性风险，一般值越大，系统性风险越大。",
        "波动率风险：波动率越大，个股风险越大",
        "研报提取的风险：从研报中提取公司相关的事件风险、政策风险、公司管理风险"
    ];

    render() {

        let data = getRiskDataSource.$.items.slice();
        let messageData = [],
            systemData = [],
            techData = [],
            content = null;
        if (data.length) {
            data.map((item, index) => {
                if (item.type == 'TECHNIQUE') {
                    techData.push(
                        <li key={index}>
                            <span>{item.message}</span>
                        </li>
                    )
                } else if (item.type == 'SYSTEM') {
                    systemData.push(
                        <li key={index}>
                            <span>{item.message}</span>
                        </li>
                    )
                } else if (item.type == 'MESSAGE') {
                    messageData.push(
                        <li key={index}>
                            <span>{item.message}</span>
                        </li>
                    )
                }
            });
            let techText = null,
                sysText = null,
                mesText = null;
            if (techData.length) {
                techText = (
                    <div>
                        <p className="titleSmallMargin">技术风险:</p>
                        <ul className={this.props.small ? "riskUlSmall" : "riskUl"}
                            style={this.props.showPdf ? this.styles.leftPadding : {}}>
                            {techData}
                        </ul>
                    </div>
                )
            }

            if (systemData.length) {
                sysText = (
                    <div>
                        <p className="titleSmallMargin">系统风险:</p>
                        <ul className={this.props.small ? "riskUlSmall" : "riskUl"}
                            style={this.props.showPdf ? this.styles.leftPadding : {}}>
                            {systemData}
                        </ul>
                    </div>
                )
            }

            if(messageData.length){
                mesText = (
                    <div>
                        <p className="titleSmallMargin">事件风险:</p>
                        <ul className={this.props.small ? "riskUlSmall" : "riskUl"}
                            style={this.props.showPdf ? this.styles.leftPadding : {}}>
                            {messageData}
                        </ul>
                    </div>
                )
            }
            content = (
                <div>
                    {mesText}
                    {sysText}
                    {techText}
                </div>
            )
        } else {
            content = (
                <div>
                    暂无数据
                </div>
            )
        }
        return (
            <div>
                <If condition={!this.props.small}>
                    <div style={this.props.showPdf ? {} : this.styles.padding}>
                        <div className="title boldText">
                            风险评估
                            <Explain
                                message={this.explainText}
                                toolTipWidth="450px"
                            />
                        </div>
                        {content}
                    </div>
                </If>
                <If condition={this.props.small}>
                    <div>
                        {content}
                    </div>
                </If>
            </div>

        )
    }
}