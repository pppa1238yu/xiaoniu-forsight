import * as React from "react";
import {CategorySummaryDataSource} from "../../model/ajax/CategoryService";
import SortButton from "../common/SortButton";
import Paper from "material-ui/Paper";
import TimeButton from "../common/TimeButton";
import {CategorySortedType} from "../../model/entities/category/CategorySortedType";

interface Props {
    service: CategorySummaryDataSource;
    times: Array<string>;
    sorts: Array<string>;
    onTimeChange: (number) => void;
    onSortChange: (CategorySortedType) => void;
}
interface State {
    time: number;
    sort: CategorySortedType;
}
export default class ComputerFilterView extends React.Component<Props, State> {
    styles = {
        paper: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 9,
            paddingBottom: 10,
        },
        selectContainer: {
            marginLeft: 'auto',
        },
        clearColor: {
            color: null,
        },
        select: {
            marginLeft: 16,
        },
        selectLabel: {
        },
    };

    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            time: this.props.service.time,
            sort: this.props.service.sort
        };
    }

    handleChange = (time) => {
        //this.setState({time});
        this.props.onTimeChange(time);
    };

    handleSortChange = (sort) => {
        //this.setState({sort});
        this.props.onSortChange(sort);
    };

    render() {

        return (
            <div>
                <Paper style={this.styles.paper}>
                    <div className="flex-center" >
                        <div role="sortChangeButton" className="auto-right">
                            <SortButton
                                onValueChange={
                                    this.handleSortChange
                                }
                                value={this.state.sort}
                                values={this.props.sorts}/>
                        </div>
                        <div role="timeChangeButton" className="">
                            <TimeButton
                                onValueChange={
                                    this.handleChange
                                }
                                value={this.state.time}
                                values={this.props.times}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}