import {AppendableDataSource} from "./DataSource";
import {runInAction} from "mobx";
import {http} from "./Http";
import {reportFollowedState, announceFollowedState} from "../state/States";
import {Report} from "../entities/Report";
import {Notice} from "../entities/recommend/Notice";
import {HotNews} from "../entities/recommend/HotNews";
import {NewsFlash} from "../entities/recommend/NewsFlash";
import {tipManager} from "../state/TipManager";
export abstract class RecommendedSystemDataSource<E> extends AppendableDataSource<E> {
    id: any;

    offset: number = 0;

    limit: number = 10;

    hasMore: boolean = false;

    notifyResult: (err?) => {};

    annId: any;

    setNotifyResult(func) {
        this.notifyResult = func;
    }

    protected onRefresh(): void {
        http
            .post(this.uri, this.paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(
                err => {
                    runInAction(() => {
                        if (this.notifyResult) {
                            this.fail(null);
                            this.notifyResult(false);
                            this.notifyResult = null;
                        } else {
                            this.fail(err)
                        }
                    });
                }
            );
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.offset += value.length;
        this.hasMore = value.length != 0;
        if (this.notifyResult) {
            this.notifyResult(false);
            this.notifyResult = null;
        }
    }


    public resetWithId(id?: any): void {
        this.id = id;
        this.reset();
    }


    protected onReset(): void {
        super.onReset();
        this.offset = 0;
        this.hasMore = true;
    }

    setMount(mount) {
        this.mount = mount;
        if (!this.mount && this.error) {
            tipManager.hidden();
        }
    }

    request() {
        if (this.error) {
            tipManager.hidden();
        }
        this.refresh(
            (succ, error) => {
                if (!succ && error && this.mount) {
                    tipManager.showTip("推荐信息获取失败");
                }
            }
        );
    }

    protected abstract get uri(): string;

    protected abstract get paramMap();
}

//----------------------------------------------------------------------------------------------热门新闻
class HotNewsDataSource extends RecommendedSystemDataSource<HotNews> {
    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.offset?this.limit:30
        };
    }

    protected get uri(): string {
        return '/hotTopic/hotTopicNews.json';
    }

}
export let hotNewsDataSource = new HotNewsDataSource();

//----------------------------------------------------------------------------------------------公告
class NoticeDataSource extends RecommendedSystemDataSource<Notice> {
    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.offset?this.limit:30
        };
    }

    protected get uri(): string {
        return '/announcement/announcements.json';
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        announceFollowedState.processMulti(value);//公告可以收藏
    }
}
export let noticeDataSource = new NoticeDataSource();

//----------------------------------------------------------------------------------------------收藏的公告

class FavorNoticeDataSource extends RecommendedSystemDataSource<Notice>{
    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.limit
        };
    }

    protected get uri(): string {
        return '/announcement/attentions.json';
    }

    protected onSuccess(value): void {
        super.onSuccess(value);
        this.hasMore = value.length >= 10;
        announceFollowedState.processMulti(value);//公告可以收藏
    }
}
export let favorNoticeDataSource = new FavorNoticeDataSource();

//----------------------------------------------------------------------------------------------快讯
class NewsFlashDataSource extends RecommendedSystemDataSource<NewsFlash> {
    protected get paramMap() {
        return {
            offset: this.offset,
            limit: this.offset?this.limit:20
        };
    }

    protected get uri(): string {
        return '/news/suggestionNewsFlows.json';
    }
}
export let newsFlashDataSource = new NewsFlashDataSource();

