import * as React from "react";
import {observer} from "mobx-react";
import {ratingChangeAnalystsDataSource} from "../../model/ajax/KlineService";
import {Card, CardMedia, CardTitle} from "material-ui/Card";
import {Optional} from "../../model/entities/Optional";
import {ViewpointResearcherMapping} from "../../model/entities/ViewpointResearcherMapping";
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table";
import UltimatePaginationMaterialUi from "react-ultimate-pagination-material-ui";
import {Page} from "../../model/entities/Page";
interface AnalystRatingDetailViewProps {
    stockCode: string;
}
@observer
export default class AnalystRatingDetailView extends React.Component<AnalystRatingDetailViewProps, null> {
    private tableConfig = {showCheckboxes: false, showRowHover: true};
    private typeMapping = {
        STRONGSELL: '卖出',
        SELL: '减持',
        NEUTRAL: '中性',
        HOLD: '持有',
        BUY: '增持',
        STRONGERBUY: '买入',
        STRONGESTBUY: '强烈买入'
    };

    styles = {
        container: {
            margin: '0 auto',
            position: 'relative',
        },
        tableContainer: {
            minHeight: 200,
        },
        table: {
        },
        empty: {
            width: '100%',
            height: 160,
            paddingTop: 60,
            left: 0,
            top: 0,
        },
        tableCell: {
            textAlign: 'center',
            paddingLeft: 2,
            paddingRight: 2,
        },
    };

    render() {
        let ratingChangeAnalyst = Optional.of(ratingChangeAnalystsDataSource.$);
        let pageOptional: Optional<Page<ViewpointResearcherMapping>> = ratingChangeAnalyst.map(r => r.page);
        let entities: Array<ViewpointResearcherMapping> = pageOptional.map(p => p.entities).orElse([]);
        let totalAnalyst: number = ratingChangeAnalyst.map(r => r.totalAnalyst).value;
        let loading = null;
        let error = null;
        let footer = null;
        if (ratingChangeAnalystsDataSource.loading) {
            //TODO
            //loading = <FixLoading/>;
        } else if (ratingChangeAnalystsDataSource.error) {
            //TODO
        }
        if (ratingChangeAnalystsDataSource.$ &&
            ratingChangeAnalystsDataSource.$.page &&
            ratingChangeAnalystsDataSource.$.page.totalRowCount > 0) {
            if (ratingChangeAnalystsDataSource.$.page.pageCount > 1) {
                footer = (
                    <div role="pageTurner" className="center-align">
                        <UltimatePaginationMaterialUi
                            currentPage={pageOptional.map(p => p.pageIndex + 1).orElse(1)}
                            totalPages={pageOptional.map(p => p.pageCount).orElse(1)}
                            hidePreviousAndNextPageLinks={true}
                            hideFirstAndLastPageLinks={true}
                            onChange={value => this.swithToPage(value)}
                        />
                    </div>
                )
            }
        } else if (
            ratingChangeAnalystsDataSource.$ &&
            ratingChangeAnalystsDataSource.$.page) {
            return (
                 <div style={this.styles.container as any}>
                     <div role="pageTurner" className="center-align" style={this.styles.empty as any}>
                         暂无数据
                     </div>
                 </div>
            );
        }
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.tableContainer}>
                <Table fixedHeader style={this.styles.table}>
                    <TableHeader displaySelectAll={this.tableConfig.showCheckboxes}
                                 adjustForCheckbox={this.tableConfig.showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn style={this.styles.tableCell}>券商</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tableCell}>评级</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tableCell}>时间</TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.tableCell}>分析师</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={this.tableConfig.showCheckboxes}
                        showRowHover={this.tableConfig.showRowHover}
                    >
                        {
                            entities.map((entity, i) => {
                                let researcher = Optional.of(entity).map(e => e.researcher);
                                let brokerage = researcher.map(r => r.brokerage);
                                let viewpoint = Optional.of(entity).map(e => e.viewpointRating);
                                return <TableRow role="stockItemOfRatingDetailView" key={i}>
                                    <TableRowColumn role="brokerage" style={this.styles.tableCell}>{brokerage.map(v => v.shortName).orElse("-")}</TableRowColumn>
                                    <TableRowColumn role="viewPoint" style={this.styles.tableCell}>{viewpoint.map(v => {return v.standardRating == "强烈买入"?"买入":v.standardRating}).orElse("-")}</TableRowColumn>
                                    <TableRowColumn role="reportDate" style={this.styles.tableCell}>{viewpoint.map(v => v.reportDate).orElse("-")}</TableRowColumn>
                                    <TableRowColumn role="analystName" style={this.styles.tableCell}>
                                        {
                                            researcher.map(r => r.gtaId).value ?
                                                <a role="linktoAnalystDetailPage" href={"#/analyst/detail/" + researcher.map(r => r.gtaId).value}>{ researcher.map(r => r.fullName).orElse("-")}</a>
                                                : researcher.map(r => r.fullName).orElse("-")
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
                </div>
                {footer}
                {loading}
            </div>
        )
    }

    swithToPage(value: number) {
        let ratingChangeAnalyst = Optional.of(ratingChangeAnalystsDataSource.$);
        let page = ratingChangeAnalyst.map(r => r.page).value;
        if (page != null) {
            page.pageIndex = value - 1;
            ratingChangeAnalystsDataSource.refresh();
        }
    }

    componentWillMount() {
        ratingChangeAnalystsDataSource.stockCode = this.props.stockCode;
        ratingChangeAnalystsDataSource.reset();
        ratingChangeAnalystsDataSource.refresh();
    }
}