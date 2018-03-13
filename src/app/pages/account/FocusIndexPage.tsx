import * as React from "react";
import {observer} from "mobx-react";
import {observable, runInAction} from "mobx";
import {RouteComponentProps} from "react-router";
import {Tab, Tabs} from "material-ui/Tabs";
import {Page} from "../../model/entities/Page";
import {FirstLoading, FixLoading} from "../../components/common/Loading";
import Paper from "material-ui/Paper";
import {http} from "../../model/ajax/Http";
import {default as Constants, Util} from "../../Constants";
import ShowMore from "../../components/common/ShowMore";
import {FocusEntity} from "../../model/entities/focus/FocusEntity";
import FocusTabView from "./FocusTabView";
import {BottomNavigation, BottomNavigationItem} from "material-ui/BottomNavigation";
import Empty from "../../components/common/Empty";
import {barInteraction} from "../../components/bar/BarInteraction";
import {analystFollowedState, industryFollowedState, subjectFollowedState} from "../../model/state/States";
import {tipManager} from "../../model/state/TipManager";
import {widthListener, WidthNotifier} from "../../model/state/WidthNotifier";
import {fixButtonManager} from "../../model/state/FixButtonManager";
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
@observer
export default  class FocusIndexPage extends React.Component<RouteComponentProps<null>, null>{
    static path = '/focus';
    static title = '我的关注';

    @observable private loading: boolean = false;
    @observable private error: boolean = false;
    @observable private firstLoading:boolean = true;
    page = new Page<FocusEntity>();
    changeTab = false;
    slideIndex = 0;
    changePage = 0;
    pageNumber = {
        analyst:0,
        subject:0,
        industry:0
    };
    small;
    empty:boolean  = true;
    private timerStatus: boolean = true;

    widthNotifier: WidthNotifier = null;

    componentDidMount() {
        barInteraction.title = FocusIndexPage.title;
        barInteraction.custom = true;
    }

    componentWillUnmount() {
        widthListener.unRegister(this.widthNotifier);
        this.timerStatus = false;
        barInteraction.restore();

        tipManager.hidden();
        fixButtonManager.hidden()
    }

    style={
        tabs:{
            position:'relative',
            zIndex:10,
            width:'100%',
            fontSize:'14px',
            borderBottom:'1px solid #393f4f'
        },
        container: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        root: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
            paddingBottom: 24,
        },
        rootSmall: {
            position: 'relative',
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        floatButton: {
            position: 'fixed',
            bottom: '32px',
            right: '24px',
            zIndex: 5,
        },
        labelColor: {
            color:'#616161',
        },
        inkBarStyle: {
            backgroundColor:red500
        }
    };
    // 更新整个页面
    private refresh(index, pageNumber:number) {
        let hrefAry = ["/favourites/analysts.json","/favourites/industries.json","/favourites/subjects.json"];
        runInAction(() => {
            this.loading = true;
            this.error = false;
        });

        http.post(
                hrefAry[index],
                {
                    pageIndex: pageNumber,
                    pageSize: 36,
                    timeWindowValue: 0,
                    timeWindowUnit:'DAY'
                }
        ).then((page) => {

            if (index == 0) {
                analystFollowedState.processMulti(page.entities);
            } else if (index == 1) {
                industryFollowedState.processMulti(page.entities);
            } else if (index == 2) {
                subjectFollowedState.processMulti(page.entities);
            }

            if (!this.small) {
                this.page = page;
            } else {
                if (this.firstLoading || this.changeTab) {
                    this.page = page;
                } else {
                    page.entities = this.page.entities.concat(page.entities);
                    this.page = page;
                }
            }
            runInAction(() => {
                this.empty = this.page.totalRowCount == 0;
                if (this.firstLoading) {
                    this.firstLoading = false;
                    this.setFixButton();
                }

                this.loading = false;
                this.error = false;
                this.changeTab = false;
                //this.changePage++;
            });
        }).catch(() => {
            runInAction(() => {
                if (this.firstLoading) {
                    tipManager.showRefresh(() => {
                        this.refresh(0, 0);
                    })
                } else if (this.changeTab) {
                    tipManager.showRefresh(() => {
                        switch (this.slideIndex) {
                            case 0:
                                this.refresh(this.slideIndex, this.pageNumber.analyst);
                                break;
                            case 1:
                                this.refresh(this.slideIndex, this.pageNumber.industry);
                                break;
                            case 2:
                                this.refresh(this.slideIndex, this.pageNumber.subject);
                                break;
                            default:break;
                        }

                    });
                } else {

                    tipManager.showRefresh(() => {
                        this.refresh(this.slideIndex, this.changePage);
                    });
                }
                this.loading = false;
                this.error = true;
            });
        });
    }

    private pageChange(uiPageIndex: number) {

        this.changeTab = false;
        this.changePage = uiPageIndex - 1;
        switch (this.slideIndex) {
            case 0:this.pageNumber.analyst = uiPageIndex - 1;break;
            case 1:this.pageNumber.industry = uiPageIndex - 1;break;
            case 2:this.pageNumber.subject = uiPageIndex - 1;break;
            default:break;
        }
        this.refresh(this.slideIndex, uiPageIndex - 1);
    }

    setFixButton = () => {
        if (this.firstLoading) {
            return;
        }

        if (Util.small(this.widthNotifier.device)) {
            fixButtonManager.showOnlyUp();
        } else {
            fixButtonManager.hidden();
        }
    };

    componentWillMount(){
        this.widthNotifier = widthListener.createWidthNotifier(this.setFixButton);
        this.refresh(0, 0);

        Util.scrollTopInstant();
    }

    handleChange = (value) => {
        this.slideIndex = value;
    };

    private handleClick(){
        this.changeTab = true;
        this.changePage = 0;
        switch (this.slideIndex) {
            case 0:
                this.refresh(this.slideIndex, this.pageNumber.analyst);
                break;
            case 1:
                this.refresh(this.slideIndex, this.pageNumber.industry);
                break;
            case 2:
                this.refresh(this.slideIndex, this.pageNumber.subject);
                break;

            default:break;
        }
    }

    render() {
        let small = Util.small(this.widthNotifier.device);
        const fixDrawer = Util.fixDrawer(this.widthNotifier.device);
        const middleDown = Util.middleDown(this.widthNotifier.device);
        this.small =  small;

        let showUi = null;

        if (this.firstLoading) {
            if (this.loading) {
                return <FirstLoading label="努力加载中..." mobile={small}/>
            } else {
                return null;
            }
        }

        if (!this.loading && this.error && (!this.small || (this.small && this.changeTab))) {
            showUi = null;
        } else {

            let progress = null;
            if (this.loading && (this.changeTab || !this.small)) {
                if (this.small) {
                    progress = <FirstLoading mobile/>;
                } else {
                    progress = <FixLoading mobile={this.small} transparent/>;
                }
            }

            let content = null;
            let uiPage = null;
            if (!this.empty) {
                if (this.small) {
                    if (this.page.pageIndex < this.page.pageCount - 1) {
                        uiPage = (
                            <Paper>
                                <ShowMore loading={this.loading}
                                          onTouchTap={
                                              (event) => {
                                                  this.changeTab = false;
                                                  event.preventDefault();
                                                  this.changePage = this.page.pageIndex + 1;
                                                  this.refresh(this.slideIndex, this.page.pageIndex + 1);
                                              }
                                          }/>
                            </Paper>
                        );
                    } else {
                        uiPage = null;
                    }
                }

                content = (this.loading && this.changeTab) ? null : (
                    <div style={this.style.container as any}>
                        <FocusTabView
                            page={this.page}
                            empty={this.empty}
                            small={this.small}
                            pageChange={this.pageChange.bind(this)}
                            fixDrawer={fixDrawer}
                            loadIndex={this.slideIndex}/>
                        {uiPage}
                    </div>
                );


            } else {
                content = <Empty mobile={small} imageLink={Constants.noDataImage} label=""/>;
            }

            showUi =
                <div style={this.small ? this.style.rootSmall as any: this.style.root as any}>
                    {progress}
                    {content}
                </div>;
        }
        return (
            <div style={this.style.container as any}>
                <Tabs
                    onChange={this.handleChange}
                    value={this.slideIndex}
                    style={this.style.tabs}
                    inkBarStyle = {this.style.inkBarStyle}
                    tabItemContainerStyle={{backgroundColor:'#fff'}}
                >
                    <Tab role="analystTab" label="分析师" value={0}  key={0}
                         style={this.style.labelColor}
                         onClick={this.handleClick.bind(this)}
                    >
                    </Tab>
                    <Tab role="industryTab" label="行业研究" value={1}  key={1}
                         style={this.style.labelColor}
                         onClick={this.handleClick.bind(this)}
                    >
                    </Tab>
                    <Tab role="subjectTab" label="题材机会" value={2}  key={2}
                         style={this.style.labelColor}
                         onClick={this.handleClick.bind(this)}
                    >
                    </Tab>
                </Tabs>
                {showUi}
        </div>)
    }
}
