import * as React from "react";
import {observer} from "mobx-react";
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table";

interface TargetValuesProps {
    stockCode: string;
}
@observer
export default class TargetValuesView extends React.Component<TargetValuesProps, null> {
    private tableConfig = {showCheckboxes: false, showRowHover: true};

    render() {
        return (
            <Table height="10em">
                <TableHeader displaySelectAll={this.tableConfig.showCheckboxes}
                             adjustForCheckbox={this.tableConfig.showCheckboxes}>
                    <TableRow>
                        <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
                            Super Header
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={this.tableConfig.showCheckboxes}
                    showRowHover={this.tableConfig.showRowHover}
                >
                    <TableRow>
                        <TableRowColumn>ID</TableRowColumn>
                        <TableRowColumn>Name</TableRowColumn>
                        <TableRowColumn>Status</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }
}