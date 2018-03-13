import * as React from "react";
import IconButton from "material-ui/IconButton";
import Favorite from "material-ui/svg-icons/content/add-circle-outline";
import RemoveFavorite from "material-ui/svg-icons/action/check-circle";
import AddCircle from "material-ui/svg-icons/content/add-circle";
import Check from "material-ui/svg-icons/action/check-circle";
import {
    blue500,
    blueGrey500,
    cyan500,
    green400,
    green500,
    greenA200,
    grey500,
    red300,
    red500,
    yellow600
} from "material-ui/styles/colors";
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import {http} from "../../model/ajax/Http";
import FloatingActionButton from "material-ui/FloatingActionButton";
import {stateManager} from "../../model/state/States";
import {List, ListItem} from "material-ui/List";
import {EntityType} from "../../model/entities/EntityType";
import {tipManager} from "../../model/state/TipManager";
import {watchSearcher} from "../../pages/smartAccount/WatchSearcher";
export enum AttentionStyle {
    ICON,
    FLOATING,
    ITEM,
    STOCK
}

interface Props {
    code: any;
    type: EntityType;
    fixDrawer: boolean;
    style: AttentionStyle;
}

const FOLLOW_META = {

    analyst: {
        followUri: "/favourites/followAnalyst.json",
        unfollowUri: "/favourites/unfollowAnalyst.json",
        paramName: "analystId",
        label: '关注',
        unLabel: '取消关注',
    },
    subject: {
        followUri: "/favourites/followSubject.json",
        unfollowUri: "/favourites/unfollowSubject.json",
        paramName: "subjectCode",
        label: '关注',
        unLabel: '取消关注',
    },
    industry: {
        followUri: "/favourites/followIndustry.json",
        unfollowUri: "/favourites/unfollowIndustry.json",
        paramName: "industryCode",
        label: '关注',
        unLabel: '取消关注',
    },
    report: {
        followUri: "/favourites/followReport.json",
        unfollowUri: "/favourites/unfollowReport.json",
        paramName: "reportId",
        label: '收藏',
        unLabel: '取消收藏',
    },
    stock: {
        followUri: "/stockAttention/followStock.json",
        unfollowUri: "/stockAttention/unfollowStock.json",
        paramName: "symbol",
        label: '添加自选股',
        unLabel: '移除自选股',
    },
    announce: {
        followUri: "/announcement/follow.json",
        unfollowUri: "/announcement/unfollow.json",
        paramName: "annId",
        label: '收藏',
        unLabel: '取消收藏',
    }
};

@observer
export default class Attention extends React.Component<Props, any> {

    followUri: string;
    unfollowUri: string;
    paramName: string;
    label: string;
    unLabel: string;

    @observable followed: boolean;

    @observable error: boolean = false;


    constructor(props, context) {
        super(props, context);
        let metaInfo = null;
        switch (this.props.type) {
            case EntityType.RESEARCHER:
                metaInfo = FOLLOW_META.analyst;
                break;
            case EntityType.INDUSTRY:
                metaInfo = FOLLOW_META.industry;
                break;
            case EntityType.SUBJECT:
                metaInfo = FOLLOW_META.subject;
                break;
            case EntityType.REPORT:
                metaInfo = FOLLOW_META.report;
                break;
            case EntityType.STOCK:
                metaInfo = FOLLOW_META.stock;
                break;
            case EntityType.ANNOUNCE:
                metaInfo = FOLLOW_META.announce;
                break;
            default:
                throw new Error("don't support this entity type.")
        }
        this.followUri = metaInfo.followUri;
        this.unfollowUri = metaInfo.unfollowUri;
        this.paramName = metaInfo.paramName;
        this.label = metaInfo.label;
        this.unLabel = metaInfo.unLabel;
        this.followed = stateManager.getFollowed(this.props.code, this.props.type);
    }

    private unFollow() {
        runInAction(() => {
            this.followed = false;
            this.error = false;
            stateManager.setFollowed(this.props.code, false, this.props.type);
        });
        let param = {};
        param[this.paramName] = this.props.code;
        http.post(
            this.unfollowUri,
            param
        ).then(result => {
                if (result.success) {
                    watchSearcher.call();
                    //this.followed = false;
                } else {
                    runInAction(() => {
                        this.followed = true;
                        this.error = true;
                        stateManager.setFollowed(this.props.code, true, this.props.type);
                    });
                }
            }
        ).catch(() => {
            runInAction(() => {
                this.followed = true;
                this.error = true;
                stateManager.setFollowed(this.props.code, true, this.props.type);
                tipManager.showTip("操作失败")
            })
        });
    }

    private follow() {
        runInAction(() => {
            this.followed = true;
            this.error = false;
            stateManager.setFollowed(this.props.code, true, this.props.type);
        });
        let param = {};
        param[this.paramName] = this.props.code;
        http.post(
            this.followUri,
            param
        ).then((result) => {
                if (result.success) {
                    watchSearcher.call();
                    //this.followed = true;
                } else {
                    runInAction(() => {
                        this.followed = false;
                        this.error = true;
                        stateManager.setFollowed(this.props.code, false, this.props.type);
                    });
                }
            }
        ).catch(() => {
            runInAction(() => {
                this.followed = false;
                this.error = true;
                stateManager.setFollowed(this.props.code, false, this.props.type);
                tipManager.showTip("操作失败")
            });
        });
    }

    styles = {
        container: {
            zIndex: 5,
        },
        iconStyles: {
            width: '20px',
            height: '20px'
        }
    };

    render() {
        if (this.props.style == AttentionStyle.FLOATING) {
            if (this.followed) {
                if (this.props.type == EntityType.STOCK) {
                    return (
                        <FloatingActionButton mini onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.unFollow()
                            }
                        }
                        >
                            <Check/>
                        </FloatingActionButton>
                    );
                } else {
                    return (
                        <FloatingActionButton mini onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.unFollow()
                            }
                        }
                        >
                            <Favorite/>
                        </FloatingActionButton>
                    );
                }

            } else {
                if (this.props.type == EntityType.STOCK) {
                    return (
                        <FloatingActionButton mini onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.follow()
                            }
                        }
                                              backgroundColor={grey500}
                        >
                            <AddCircle/>
                        </FloatingActionButton>
                    );
                } else {
                    return (
                        <FloatingActionButton mini onTouchTap={
                            (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.follow()
                            }
                        }
                                              backgroundColor={grey500}
                        >
                            <Favorite/>
                        </FloatingActionButton>
                    );
                }

            }
        } else if (this.props.style == AttentionStyle.ITEM) {
            if (this.followed) {
                if (this.props.type == EntityType.STOCK) {
                    return <ListItem primaryText={this.unLabel}
                                     onTouchTap={
                                         (event) => {
                                             event.preventDefault();
                                             event.stopPropagation();
                                             this.unFollow()
                                         }}
                                     leftIcon={<Check color={red500} style={this.styles.iconStyles}/>}
                    />
                } else {
                    return <ListItem primaryText={this.unLabel}
                                     onTouchTap={
                                         (event) => {
                                             event.preventDefault();
                                             event.stopPropagation();
                                             this.unFollow()
                                         }}
                                     leftIcon={<RemoveFavorite color={red500}/>}
                    />
                }

            } else {
                if (this.props.type == EntityType.STOCK) {
                    return <ListItem primaryText={this.label}
                                     onTouchTap={
                                         (event) => {
                                             event.preventDefault();
                                             event.stopPropagation();
                                             this.follow()
                                         }}
                                     leftIcon={<AddCircle color={grey500} style={this.styles.iconStyles}/>}
                    />
                } else {
                    return <ListItem primaryText={this.label}
                                     onTouchTap={
                                         (event) => {
                                             event.preventDefault();
                                             event.stopPropagation();
                                             this.follow()
                                         }}
                                     leftIcon={<Favorite color={grey500}/>}
                    />
                }

            }

        } else if (this.props.style == AttentionStyle.STOCK) {
            if (this.followed) {
                return <ListItem primaryText={this.unLabel}
                                 onTouchTap={
                                     (event) => {
                                         event.preventDefault();
                                         event.stopPropagation();
                                         this.unFollow()
                                     }}
                                 innerDivStyle={{padding: '16px 16px 16px 45px'}}
                                 leftIcon={<Check color={red500} style={this.styles.iconStyles}/>}
                />
            } else {
                return <ListItem primaryText={this.label}
                                 onTouchTap={
                                     (event) => {
                                         event.preventDefault();
                                         event.stopPropagation();
                                         this.follow()
                                     }}
                                 innerDivStyle={{padding: '16px 16px 16px 45px'}}
                                 leftIcon={<AddCircle color={grey500} style={this.styles.iconStyles}/>}
                />
            }
        } else {
            if (this.followed) {
                if (this.props.type == EntityType.STOCK) {
                    return (
                        <div>
                            <IconButton
                                iconStyle={this.styles.iconStyles}
                                onTouchTap={
                                    (event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        this.unFollow()
                                    }
                                }>
                                <Check color={red500} hoverColor={grey500}/>
                            </IconButton>
                        </div>

                    )
                } else {
                    return (
                        <div>
                            <IconButton tooltip={this.unLabel} onTouchTap={
                                (event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.unFollow()
                                }
                            }>
                                <RemoveFavorite color={grey500} hoverColor={grey500}/>
                            </IconButton>
                        </div>

                    )
                }
            } else {
                if (this.props.type == EntityType.STOCK) {
                    return (
                        <div>
                            <IconButton
                                iconStyle={this.styles.iconStyles}
                                onTouchTap={
                                    (event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        this.follow()
                                    }
                                }>
                                <AddCircle color={grey500} hoverColor={red500} style={this.styles.iconStyles}/>
                            </IconButton>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <IconButton tooltip={this.label} onTouchTap={
                                (event) => {
                                    event.stopPropagation();
                                    event.preventDefault();

                                    this.follow()
                                }
                            }>
                                <Favorite color={grey500} hoverColor={red500}/>
                            </IconButton>
                        </div>
                    )
                }

            }

        }
    }
}
