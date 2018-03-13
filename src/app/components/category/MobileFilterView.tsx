import * as React from "react";
import SortDialog from "../common/SortDialog";
import Time from "material-ui/svg-icons/device/access-time";
import Sort from "material-ui/svg-icons/content/sort";
import {CategorySummaryDataSource} from "../../model/ajax/CategoryService";
import {fixButtonManager} from "../../model/state/FixButtonManager";

interface Props {
    service: CategorySummaryDataSource;
    times: Array<string>;
    sorts: Array<string>;
    onTimeChange: (number) => void;
    onSortChange: (CategorySortedType) => void;
}

interface State {
    openFilter: boolean;
    openSort: boolean;
}

export default class MobileFilterView extends React.Component<Props, State> {
    constructor(props, context?) {
        super(props, context);
        this.state = {
            openFilter: false,
            openSort: false,
        }
    };

    handleOpenFilter = () => {
        this.setState({openFilter: true});
    };

    handleCloseFilter = () => {
        this.setState({openFilter: false});
    };

    handleOpenSort = () => {
        this.setState({openSort: true});
    };

    handleCloseSort = () => {
        this.setState({openSort: false});
    };

    componentWillUnmount() {
        fixButtonManager.hidden();
    }

    componentWillMount() {
        fixButtonManager.showDefaultMulti([
            {icon: <Sort />, onTouchTap: this.handleOpenFilter},
            {icon: <Time />, onTouchTap: this.handleOpenSort}
        ]);
    }

    render() {
        return (
            <div>
                <SortDialog
                    open={this.state.openSort}
                    handleClose={this.handleCloseSort}
                    title="时间范围选择"
                    value={this.props.service.time}
                    values={this.props.times}
                    onValueChange={this.props.onTimeChange}
                />
                <SortDialog
                    open={this.state.openFilter}
                    handleClose={this.handleCloseFilter}
                    title="排序方式选择"
                    value={this.props.service.sort}
                    values={this.props.sorts}
                    onValueChange={this.props.onSortChange}
                />
            </div>
        );
    }
}