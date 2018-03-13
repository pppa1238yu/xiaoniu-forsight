import * as React from "react";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import {List, ListItem} from "material-ui/List";
import Divider from "material-ui/Divider";
import {Link, withRouter} from "react-router-dom";

import IndexPage from "../../pages/home/IndexPage";
import SmartAccountPage from "../../pages/smartAccount/SmartAccountPage";
import AnalystIndexPage from "../../pages/analyst/AnalystIndexPage";
import Constants from "../../Constants";
import Exit from "material-ui/svg-icons/action/exit-to-app";
import Setting from "material-ui/svg-icons/action/settings";
import Favour from "material-ui/svg-icons/action/favorite-border";
import Iphone from "material-ui/svg-icons/hardware/phone-iphone";
import Trend from "material-ui/svg-icons/action/trending-up";
import Search from "material-ui/svg-icons/action/search";
import Send from "material-ui/svg-icons/content/send";
import LinkIcon from "material-ui/svg-icons/content/link";
import Add from "material-ui/svg-icons/content/add-circle-outline";
import Group from "material-ui/svg-icons/social/group";
import Toy from "material-ui/svg-icons/hardware/toys";
import PieChart from "material-ui/svg-icons/editor/pie-chart";
import MenuItem from "material-ui/MenuItem";
import {barInteraction} from "./BarInteraction";
import {observer} from "mobx-react";
import StockIndexPage from "../../pages/stock/StockIndexPage";
import {lightBlue200, purple500, red400, red500} from "material-ui/styles/colors";
import FloatingActionButton from "material-ui/FloatingActionButton";
import {PopoverAnimationVertical} from "material-ui/Popover";
import IconMenu from "material-ui/IconMenu";
import {userDataSource} from "../../model/ajax/UserService";
import AccountSettingPage from "../../pages/account/AcountSettingPage";
import CollectIndexPage from "../../pages/account/CollectIndexPage";
import IndustryIndexPage from "../../pages/category/IndustryIndexPage";
import SubjectSummaryPage from "../../pages/category/SubjectIndexPage";
import {http} from "../../model/ajax/Http";
import History from "../../router/History";
import FocusIndexPage from "../../pages/account/FocusIndexPage";
import IconButton from 'material-ui/IconButton';
import Searcher from "../common/Searcher";
import MailOutline from "material-ui/svg-icons/communication/mail-outline";
import Badge from 'material-ui/Badge';
import ActivityPage from "../../pages/activity/ActivityPage";
import {messageTipDataSource} from "../../model/ajax/ActivityService";

interface DrawerProps {
    open: boolean;
    closeDrawer: () => void;
    docked: boolean;
}

/*
 class PersonImage extends React.Component<any, null> {
 styles = {
 container: {
 width: Constants.drawerWidth,
 height: 150,
 backgroundColor: red400,
 position: 'relative',
 paddingTop: 90,
 },
 avatar: {
 position: 'absolute',
 left: 'calc(50% - 33px)',
 top: '16%',
 margin: 'auto',
 },
 text: {
 textAlign: 'center',
 fontSize: 17,
 },
 icon: {
 paddingRight: 3,
 paddingLeft: 3,
 width: 30,
 }
 };

 render() {
 return (
 <div style={this.styles.container as any}>
 <Avatar
 src="images/ok-128.jpg"
 style={this.styles.avatar}
 size={66}
 />
 <div className="flex-center-center"  style={this.styles.text as any}>
 <div>
 <IconButton style={this.styles.icon}>
 <Person/>
 </IconButton>
 </div>
 <span>胸口碎大石</span>
 </div>
 </div>
 )
 }
 }
 */

class DrawerView extends React.Component<DrawerProps, null> {

    styles = {
        title: {
            paddingLeft: 40,
            paddingTop: 4,
        },
        logoStyle: {
            height: 30
        },
        iconStyle: {
            width: 18,
            height: 18,
            top: 1,
            left: 20
        },
        hrStyle: {
            marginTop: 10,
            marginBottom: 10
        },
        flexBox: {

        },
        aiLogo: {
            paddingRight: 40,
            textAlign: 'center',
            color: '#fff',
            margin: 0
        }
    };

    render() {
        return (
            <Drawer open={this.props.open} docked={this.props.docked}
                    onRequestChange={this.props.closeDrawer}>
                <AppBar showMenuIconButton={false}
                        title={
                            <div>
                                <img src='/images/LOGO.png' style={this.styles.logoStyle}/>
                            </div>
                        }
                        titleStyle={this.styles.title}
                />
                <div className="flexBoxMobile">
                    <List>
                        <Link role="linktoDiscoverPage" to={IndexPage.path} onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={IndexPage.title}
                                      leftIcon={
                                          <Send style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(IndexPage.path);
                                          }
                                      }
                                      insetChildren
                            />
                        </Link>
                        <Divider inset style={this.styles.hrStyle}/>
                        <Link role="linktoAnalystIndexPage" to={AnalystIndexPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={AnalystIndexPage.primaryTitle}
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(AnalystIndexPage.path);
                                          }
                                      }
                                      insetChildren
                                      leftIcon={
                                          <Group style={this.styles.iconStyle}/>
                                      }
                            />
                        </Link>
                        <Link role="linktoStockIndexPage" to={StockIndexPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={StockIndexPage.primaryTitle}
                                      insetChildren
                                      leftIcon={
                                          <Trend style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(StockIndexPage.path);
                                          }
                                      }/>
                        </Link>
                        <Link role="linktoIndustryIndexPage" to={IndustryIndexPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={IndustryIndexPage.primaryTitle}
                                      insetChildren
                                      leftIcon={
                                          <Search style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(IndustryIndexPage.path);
                                          }
                                      }/>
                        </Link>
                        <Link role="linktoSubjectSummaryPage" to={SubjectSummaryPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={SubjectSummaryPage.primaryTitle}
                                      insetChildren
                                      leftIcon={
                                          <Toy style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(SubjectSummaryPage.path);
                                          }
                                      }/>
                        </Link>
                        <Divider inset style={this.styles.hrStyle}/>
                        <Link role="linktoSmartAccountPage" to={SmartAccountPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={SmartAccountPage.title}
                                      leftIcon={
                                          <PieChart style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(SmartAccountPage.path);
                                          }
                                      }
                                      insetChildren
                            />
                        </Link>
                        <Link role="linktoCollectIndexPage" to={CollectIndexPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={CollectIndexPage.title}
                                      insetChildren
                                      leftIcon={
                                          <Favour style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(CollectIndexPage.path);
                                          }
                                      }/>
                        </Link>
                        <Link role="linktoFocusIndexPage" to={FocusIndexPage.path}
                              onClick={(event) => event.preventDefault()}>
                            <MenuItem primaryText={FocusIndexPage.title}
                                      insetChildren
                                      leftIcon={
                                          <Add style={this.styles.iconStyle}/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.props.closeDrawer();
                                              History.push(FocusIndexPage.path);
                                          }
                                      }/>
                        </Link>
                    </List>

                    <div className="aiJump">
                        <a role="linktoAICalfdata" href="https://ai.calfdata.com/#/" target="_blank">
                            <p style={this.styles.aiLogo}>
                                AI实验室
                            </p>
                            <i className="aiArrow"/>
                        </a>
                    </div>
                </div>

            </Drawer>
        );
    }
}

@observer
class CustomBarView extends React.Component<any, any> {

    private timerStatus: boolean = true;

    styles = {
        bar: {
            position: 'fixed',
            top: 0,
            left: Constants.drawerWidth,
            zIndex: 2000,
            width: 'calc(100% - ' + Constants.drawerWidth + "px)",
            backgroundColor: '#5b6378'
        },
        barSmall: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 2000,
            backgroundColor: '#5b6378'
        },
        title: {
            paddingTop: 4,
            fontSize: 16
        },
        rightIcon: {
            paddingTop: 4,
            marginRight: 6,
        },
        searchButton: {
            paddingRight: 12,
        },
        smallIcon: {
            width: 32,
            height: 32,
        },
        small: {
            paddingTop: 6,
        },
        right: {
            marginLeft: 12,
        },
        headLogo: {
            width: 40,
        },
        messageIcon: {
            width: "32px",
            height: "32px",
            cursor: "pointer"
        },
        badgeStyle: {
            paddingTop: "6px",
            paddingRight: "32px"
        },
        badgePosition: {
            top: 0,
            right: 25,
            width: "18px",
            height: "18px",
            backgroundColor: red500
        },
        activityEntryIpad:{
            position:"absolute",
            left:"60px",
            height:"64px",
            cursor:"pointer"
        },
        activityEntry:{
            position:"absolute",
            left:"100px",
            height:"64px",
            cursor:"pointer"
        }
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            search: false,
            menu: false,
        };
    }

    openMenu = () => {
        this.setState({
            menu: true,
        })
    };

    closeMenu = () => {
        this.setState({
            menu: false,
        })
    };

    openSearch = () => {
        this.setState({
            search: true,
        });
    };

    closeSearch = () => {
        this.setState({
            search: false,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    refreshMethod = () => {
        messageTipDataSource.request(() => {
            if (this.timerStatus) {
                setTimeout(this.refreshMethod, 5000);
            }
        })
    };

    componentDidMount() {
        this.refreshMethod();
    }

    componentWillUnmount() {
        this.timerStatus = false
    }

    render() {
        if (this.state.search) {
            this.styles.barSmall['paddingLeft'] = 18;
            this.styles.barSmall['paddingRight'] = 0;
        } else {
            this.styles.barSmall['paddingLeft'] = 24;
            this.styles.barSmall['paddingRight'] = 24;
        }

        let title: any = Constants.title;
        let titleStyle;
        if (this.state.search) {

            title = <Searcher fixDrawer={this.props.fixDrawer} onRequestClose={this.closeSearch}/>;

        } else if (barInteraction.custom) {

            title = barInteraction.title;
            titleStyle = {fontSize: 16};

        } else if (!this.props.login) {

            title = (
                <div>
                    <img src='/images/LOGO.png'/>
                </div>
            );
            titleStyle = this.styles.title;
        }

        const name = this.props.loginName ? this.props.loginName[0] : '';

        let badge = null;
        if (messageTipDataSource.$.count !== undefined) {
            if (messageTipDataSource.$.count > 0) {
                badge = <div onClick={ () => {
                    location.replace('#/message')
                }}>
                    <Badge
                        badgeContent={messageTipDataSource.$.count}
                        secondary={true}
                        badgeStyle={this.styles.badgePosition}
                        style={this.styles.badgeStyle}
                    >
                        <MailOutline color="#fff" style={this.styles.messageIcon} hoverColor="#000"/>
                    </Badge>
                </div>
            } else {
                badge = <div
                    style={this.styles.badgeStyle as any}
                    onClick={ () => {
                        location.replace('#/message')
                    }}>
                    <MailOutline color="#fff" style={this.styles.messageIcon} hoverColor="#000"/>
                </div>
            }
        }
        const loginElement = (
            <div className="flex-start" style={this.styles.right}>
                {
                    !this.state.search ? <div style={this.styles.searchButton}>
                        <IconButton
                            role="searchButton"
                            iconStyle={this.styles.smallIcon}
                            style={this.styles.small}
                            onTouchTap={this.openSearch}
                        >
                            <Search color="#fff" hoverColor="#000"/>
                        </IconButton>
                    </div> : null
                }
                {badge}
                {   (this.props.fixDrawer || !this.state.search) ?
                    <div role="userSettingButton">
                        <IconMenu
                            open={this.state.menu}
                            iconButtonElement={
                                <FloatingActionButton mini
                                                      zDepth={0}
                                                      backgroundColor={purple500}
                                >
                                    <div>
                                        <img src="/images/headLogo.png" alt="headLogo" style={this.styles.headLogo}/>
                                        {/*{name}*/}
                                    </div>
                                </FloatingActionButton>
                            }
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            animation={PopoverAnimationVertical}
                            onTouchTap={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.openMenu();
                            }}
                            onRequestChange={
                                (open) => {
                                    if (!open) {
                                        this.closeMenu();
                                    }
                                }
                            }
                        >
                            <Link role="linktoAccountSettingPage" to={AccountSettingPage.path}
                                  onClick={(event) => event.preventDefault()}>
                                <MenuItem primaryText={AccountSettingPage.title}
                                          leftIcon={
                                              <Setting/>
                                          }
                                          onTouchTap={
                                              (event) => {
                                                  event.preventDefault();
                                                  event.stopPropagation();

                                                  History.push(AccountSettingPage.path);
                                                  this.closeMenu();
                                              }
                                          }
                                />
                            </Link>
                            <Divider/>
                            <MenuItem primaryText="小牛投研平台"
                                      role="xiaoniu"
                                      leftIcon={
                                          <LinkIcon/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              this.closeMenu();
                                              window.open('https://fineyes.calfdata.com/')
                                          }
                                      }
                            />
                            <MenuItem primaryText="登出"
                                      leftIcon={
                                          <Exit/>
                                      }
                                      onTouchTap={
                                          (event) => {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              http.get("logout.do", {})
                                                  .then(value => {
                                                      userDataSource.logout();
                                                  }).catch(err => {
                                                  window.location.reload();
                                              });
                                              this.closeMenu();

                                          }
                                      }
                            />
                        </IconMenu>
                    </div> : null
                }
            </div>
        );


        return (
            <AppBar style={!this.props.fixDrawer || !this.props.login ? this.styles.barSmall : this.styles.bar}
                    title={title}
                    titleStyle={titleStyle}
                    onLeftIconButtonTouchTap={this.props.handleDrawerToggle}
                    showMenuIconButton={this.props.login && !this.props.fixDrawer && !this.state.search}
                    iconElementRight={loginElement}
                    iconStyleRight={this.styles.rightIcon}
            >

            </AppBar>
        );
    }
}


const BarViewWithRouter = withRouter(CustomBarView);

class BarAndDrawerView extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            openDrawer: false,
        };
    }

    closeDrawer = () => {
        this.setState({openDrawer: false});
    };

    handleDrawerToggle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState((prevState) => {
            return {openDrawer: !prevState.openDrawer};
        });
    };

    render() {
        const fixDrawer = this.props.fixDrawer;
        const small=this.props.small;
        const open = this.props.login && (this.state.openDrawer || fixDrawer);

        return (
            <div>
                <BarViewWithRouter
                    fixDrawer={fixDrawer}
                    small={small}
                    login={this.props.login}
                    loginName={this.props.loginName}
                    handleDrawerToggle={this.handleDrawerToggle}/>

                <DrawerView open={open}
                            docked={fixDrawer}
                            closeDrawer={!fixDrawer ? this.closeDrawer : () => {
                            }}/>
            </div>
        );
    }

}

export default withRouter(BarAndDrawerView);

