import * as React from "react";
import {observer} from "mobx-react";
import {
    exchangeRateDataSource,
    homeTendencyDataSource,
    severalIndexesDataSource
} from "../../model/ajax/SeveralIndexes";
import MyCard from "./Card";
import Trend from "./Trend";
import Paper from "material-ui/Paper";
import {Link} from "react-router-dom";
import IdxDetailPage from "../../pages/idx/IdxDetailPage";

@observer
export default class SeveralIndexesComponent extends React.Component<any, null> {

    styles = {
        single: {
            paddingBottom: 12,
            paddingRight: 4,
            width: 230,
        },
        singleAuto: {
            paddingBottom: 12,
            paddingRight: 4,
            width: '100%',
        },
        singleContainer: {
            padding: '10px 16px',
            cursor: 'pointer',
        },
        container: {
            height:120,
            overflowY: 'hidden',
            overflowX: 'hidden'
        },
        containerAuto: {
            overflowY: 'hidden',
            overflowX: 'hidden'
        },
    };
    private timerStatus: boolean = true;

    componentDidMount() {
        // (Util.small(this.context.deviceType));
        let that = this;
        // homeTendencyDataSource.refresh();//前面五个指数的走势图
        function refreshMethod() {
            severalIndexesDataSource.refresh(() => {
                if (that.timerStatus) {
                    setTimeout(refreshMethod, 2000);
                }
            });//指数板块非走势图的数据
        }
        refreshMethod();
        // exchangeRateDataSource.refresh();//汇率指数数据
    }

    componentWillUnmount() {
        this.timerStatus = false;
    }

    render() {
        severalIndexesDataSource.registerUpdate();

        let dataSourceArr = severalIndexesDataSource.$.map(value => {
            return value
        });
        /*let exchangeRateData = exchangeRateDataSource.$;
        let right = null;
        if (!this.props.middleDown) {
            right = (
                <div style={this.styles.single}>
                    <Paper style={this.styles.singleContainer}>
                        <MyCard small={this.props.small} indexObj={exchangeRateData} exchange="exchange"/>
                        {exchangeRateData.bars.length ? <Trend bars={exchangeRateData.bars}/> : null}
                    </Paper>
                </div>
            );
        }*/

        return (
            <div role="indexComponent" style={this.props.middleDown ? this.styles.containerAuto : this.styles.container as any}>
                <div className={this.props.middleDown ? 'flex-start-center' : 'flex-start-wrap-center'}>
                    {severalIndexesDataSource.$.map((item, index) => {
                        //let everyDataSource = dataSourceArr[index];
                        //let borderColor = Optional.of(everyDataSource).map(value => value.change).value > 0 ? "2px solid #ee1d36" : "2px solid #366f06";
                        if (this.props.middleDown && index >= 3) {
                            return null;
                        }
                        let style = null;
                        if (this.props.middleDown) {
                            style = this.styles.singleAuto;
                        } else {
                            style = this.styles.single;
                        }
                        return <div key={index}
                                     style={style}>
                            <Link to={IdxDetailPage.path + item.symbol}>
                            <Paper style={this.styles.singleContainer}>
                                {item ?
                                    <MyCard small={this.props.small} key={index} indexObj={item} exchange=""/> : null
                                }
                                {
                                    <Trend key={"trend" + index} bars={undefined}/>
                                }
                            </Paper>
                            </Link>
                        </div>
                    })}
                    {/*{right}*/}
                </div>
            </div>
        );
    }
}