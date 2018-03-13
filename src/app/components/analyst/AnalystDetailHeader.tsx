import * as React from "react";
import {observer} from "mobx-react";
import {Card, CardHeader, CardMedia, CardText, CardTitle} from "material-ui/Card";
import {Follow} from "../../model/entities/Follow";
import {Researcher} from "../../model/entities/Researcher";
import Chip from "material-ui/Chip";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    grey700,
    red400,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";
interface AnalystDetailHeaderProps {
    info: Follow<Researcher>;
    small?: boolean;
    code?: any;
    fixDrawer?: boolean;
}
@observer
export default class AnalystDetailHeader extends React.Component<AnalystDetailHeaderProps, null> {
    info = this.props.info;

    componentWillReceiveProps(nextProps) {
        if (this.info != nextProps.info) {
            this.info = nextProps.info;
        }
    }

    styles =  {
        container: {

        },
        containerSmall: {
            paddingLeft: 16,
        },
        header: {
            paddingLeft: 52,
        },
        title: {
            fontSize: 16,
            color:grey700
        },
        titleOverlay: {
            width: "100%",
            paddingRight: 0,
        },
        quotation: {
            fontSize: 20,
        },
        incrementText: {
            color: red500,
            fontSize: 18,
        },
        decrementText: {
            color: green500,
            fontSize: 18,
        },
        increment: {
            color: red300,
        },
        decrement: {
            color: green500,
        },
        changeLabel: {
            color: 'white',
        },
        text: {
            color: grey500,
            fontSize: 18,
        },
        symbol: {
            fontSize: 20,
            color: grey500,
        },
        datum: {
            paddingTop:0,
            paddingBottom: 20,
            paddingLeft:52
        },
        chip: {
            marginRight: 4,
            marginTop: 1,
            marginBottom: 1
        },
        linkChip: {
            marginRight: 4,
            cursor: "pointer",
            marginTop: 1,
            marginBottom: 1,
        },
        center: {
            verticalAlign: 'middle',
        },
        chipLabel: {
        },
        business: {
            display: 'block',
        },
        businessLabel: {
            color: 'white',
        },
        image: {
            height: 70,
            width: 'auto',
        },
        tableCell: {
            width: '24%',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
            textAlign: 'left',
            color:grey700,
        },
        tableCellSmall: {
            width: '30%',
            fontSize: 14,
            paddingLeft: 2,
            paddingRight: 2,
        },
        tableContent: {
            paddingLeft: 2,
            paddingRight: 2,
        },
        otherChipContainer: {
            paddingTop: 5,
            paddingBottom: 5,
        },
        inline: {
            marginTop:'-50px',
            width:'50%',
            float:'left'
        },
        left: {
            width:'50%',
            float:'left'
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        noBottomBorder: {
            borderBottom:'none'
        }
    };

    render() {
        if (!this.info) {
            return <div/>
        }

        const analyst = this.info.target;
        const brokerage = analyst.brokerage || {} as any;
        const analystHonors = analyst.analystHonors || [];
        const csc = (analyst.gtaCsrcPersonMapping && analyst.gtaCsrcPersonMapping.csrcInfo) || {} as any;
        let title:any = analyst.title;

        if (title == undefined) {
            title = {
                typeName: '证券分析师'
            }
        }

        const specific = (title && title.id == 1);
        let analystTypeName = null;
        if (specific) {
            if (analyst.subTitle) {
                analystTypeName = analyst.subTitle.typeName + '分析师';
            } else {
                analystTypeName = title.typeName;
            }
        } else {
            analystTypeName = title.typeName;
        }

        let degree  =  null;
        if(analyst.degree != undefined){
            degree = analyst.degree;
        }else {
            degree = '-'
        }

        let school = null;
        if(analyst.gtaCsrcPersonMapping.school != undefined){
            school = analyst.gtaCsrcPersonMapping.school;
        }else {
            school = '-'
        }

        const attention =
            <Attention
                type={EntityType.RESEARCHER}
                code={this.props.code}
                fixDrawer={this.props.fixDrawer}
                style={this.props.small ? AttentionStyle.FLOATING : AttentionStyle.ICON}
            />;
        if (this.props.small) {

            return (
                <div style={this.styles.containerSmall}>
                    <Table>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover
                        >
                            <TableRow >
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    学历
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {degree}
                                </TableRowColumn>
                            </TableRow>
                            <TableRow >
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    毕业院校
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {school}
                                </TableRowColumn>
                            </TableRow>
                            <TableRow >
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    分析师类别
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {analystTypeName}
                                </TableRowColumn>
                            </TableRow>

                            <TableRow >
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    任职机构
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {brokerage.fullName}
                                </TableRowColumn>
                            </TableRow>
                            <TableRow >
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    执业荣誉
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {analystHonors.length == 0 ? '-' :
                                        <div className="flex-start-wrap">
                                            {
                                                analystHonors.map((honor, index) => {
                                                    return <span key={index} style={this.styles.chip}>
                                                                {"新财富 " + honor.ratingYear + " 年获奖"}
                                                            </span>;
                                                        // if (honor.dataSource == 1) {
                                                        //     return <span key={index} style={this.styles.chip}>
                                                        //         {"新财富 " + honor.ratingYear + " 年获奖"}
                                                        //     </span>;
                                                        //
                                                        // } else {
                                                        //     return null;
                                                        // }
                                                    }
                                                )
                                            }
                                        </div>
                                    }
                                </TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn style={this.styles.tableCellSmall}>
                                    证券业协会编码
                                </TableRowColumn>
                                <TableRowColumn style={this.styles.tableContent}>
                                    {csc.certificateNumber || '-'}
                                </TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            )
        } else {

            return <Card style={this.styles.container} zDepth={0}>
                <CardHeader
                    style={this.styles.header}
                    title={
                        <div role="analystName" className="flex-center">
                            <div>
                                {analyst.fullName}
                            </div>
                            <div role="focusButton" className="auto-right">
                                {attention}
                            </div>
                        </div>
                    }
                    titleStyle={this.styles.title}
                    textStyle={this.styles.titleOverlay}
                />
                <CardText style={this.styles.datum}>
                    <div className="">

                        <Table>
                            <TableBody
                                displayRowCheckbox={false}
                                showRowHover
                            >
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        学历
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="degree" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                            <Chip style={this.styles.chip} labelColor="#616161">
                                                {degree}
                                            </Chip>
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        毕业院校
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="college" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                            <Chip style={this.styles.chip} labelColor="#616161">
                                                {school}
                                            </Chip>
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        分析师类别
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="analystType" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                        <Chip style={this.styles.chip} labelColor="#616161">
                                            {analystTypeName}
                                        </Chip>
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        任职机构
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="brokerage" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                        <Chip style={this.styles.chip} labelColor="#616161">
                                            {brokerage.fullName}
                                        </Chip>
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        执业荣誉
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="honour" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                            {
                                               analystHonors.map((honor, index) => {
                                                   return <Chip key={index} style={this.styles.chip}
                                                         backgroundColor={red300}
                                                         labelStyle={this.styles.changeLabel}>
                                                           {"新财富 " + honor.ratingYear + " 年获奖"}
                                                       </Chip>;

                                                    }
                                                )
                                            }
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                                <TableRow style={this.styles.noBottomBorder}>
                                    <TableRowColumn style={this.styles.tableCell} className="table-cell-title">
                                        证券业协会编码
                                    </TableRowColumn>
                                    <TableRowColumn className="table-cell">
                                        <div role="certificateNumber" className="flex-center-wrap" style={this.styles.otherChipContainer}>
                                        <Chip style={this.styles.chip} labelColor="#616161">
                                            {csc.certificateNumber || '-'}
                                        </Chip>
                                        </div>
                                    </TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardText>
            </Card>
        }
    }
}