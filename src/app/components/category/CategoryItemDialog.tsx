import * as React from "react";
import Dialog from "material-ui/Dialog";
import {ListItem} from "material-ui/List";
import RemoveRedEye from "material-ui/svg-icons/image/remove-red-eye";
import {Link} from "react-router-dom";
import SubjectDetailPage from "../../pages/category/SubjectDetailPage";
import {CategoryType} from "../../model/entities/category/CategoryType";
import IndustryDetailPage from "../../pages/category/IndustryDetailPage";
import {grey500, red500} from "material-ui/styles/colors";
import Attention, {AttentionStyle} from "../common/Attention";
import {EntityType} from "../../model/entities/EntityType";

interface Props {
    type: CategoryType;
    code: string,
    open: boolean;
    handleClose: () => void;
}

export default class CategoryItemDialog extends React.Component<Props, null> {

    render() {
        return (
            <Dialog
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight
            >

                <Attention
                    type={this.props.type == CategoryType.Industry ? EntityType.INDUSTRY : EntityType.SUBJECT}
                    code={this.props.code}
                    fixDrawer={false}
                    style={AttentionStyle.ITEM}
                />
                <ListItem primaryText="查看更多"
                          containerElement={<Link to={
                              this.props.type == CategoryType.Industry ? IndustryDetailPage.PATH + this.props.code
                                  : SubjectDetailPage.PATH + this.props.code}
                          />}
                          leftIcon={<RemoveRedEye />} />
            </Dialog>
        );
    }
}
