import {EntityType} from "../entities/EntityType";

class FollowedState {
    followed = {} as any;

    getFollowed(id): boolean {
        return !!this.followed[id];
    }

    setFollowed(id, followed) {
        this.followed[id] = followed;
    }
}

class CategoryFollowedState extends FollowedState {
    process(category) {
        this.setFollowed(category.code, category.followed);
    }

    processMulti(categories) {
        for (const category of categories) {
            this.setFollowed(category.code, category.followed);
        }
    }
}

class ReportFollowedState extends FollowedState {
    process(report) {
        this.setFollowed(report.id, report.followed);
    }

    processMulti(reports) {
        for (const report of reports) {
            this.setFollowed(report.id, report.followed);
        }
    }
}

class AnalystFollowedState extends FollowedState {
    process(analyst) {
        this.setFollowed(analyst.target.gtaId, analyst.followed);
    }

    processMulti(analysts) {
        for (const analyst of analysts) {
            this.setFollowed(analyst.target.gtaId, analyst.followed);
        }
    }
}

class StockFollowedState extends FollowedState {
    process(stock) {
        this.setFollowed(stock.target.stockCode, stock.followed);
    }

    processWithDetail(stock) {
        this.setFollowed(stock.stock.symbol, stock.followed);
    }

    processMulti(stocks) {
        for (const stock of stocks) {
            if(stock.target){
                this.setFollowed(stock.target.stockCode, stock.followed);
            }else{
                const stockInfos = stock.stocks;
                for(const stockInfo  of stockInfos){
                    this.setFollowed(stockInfo.stockInfo.stockCode, true);
                }
            }
        }
    }

    processMultiWithSearch(stocks) {
        for (const stock of stocks) {
            this.setFollowed(stock.id, stock.followed);
        }
    }
}

class AnnounceFollowedState extends FollowedState {
    process(announce) {
        this.setFollowed(announce.id, announce.followed);
    }

    processMulti(announces) {
        for (const announce of announces) {
            this.setFollowed(announce.target.id, announce.followed);
        }
    }
}

export let analystFollowedState = new AnalystFollowedState();
export let industryFollowedState = new CategoryFollowedState();
export let subjectFollowedState = new CategoryFollowedState();
export let reportFollowedState = new ReportFollowedState();
export let stockFollowedState = new StockFollowedState();
export let announceFollowedState = new AnnounceFollowedState();

class StateManager {
    getFollowed(id, type): boolean {
        switch (type) {
            case EntityType.RESEARCHER:
                return analystFollowedState.getFollowed(id);
            case EntityType.INDUSTRY:
                return industryFollowedState.getFollowed(id);
            case EntityType.SUBJECT:
                return subjectFollowedState.getFollowed(id);
            case EntityType.REPORT:
                return reportFollowedState.getFollowed(id);
            case EntityType.STOCK:
                return stockFollowedState.getFollowed(id);
            case EntityType.ANNOUNCE:
                return announceFollowedState.getFollowed(id);
            default:
                throw new Error("don't support this type");
        }
    }

    setFollowed(id, followed, type) {
        switch (type) {
            case EntityType.RESEARCHER:
                analystFollowedState.setFollowed(id, followed);
                break;
            case EntityType.INDUSTRY:
                industryFollowedState.setFollowed(id, followed);
                break;
            case EntityType.SUBJECT:
                subjectFollowedState.setFollowed(id, followed);
                break;
            case EntityType.REPORT:
                reportFollowedState.setFollowed(id, followed);
                break;
            case EntityType.STOCK:
                stockFollowedState.setFollowed(id, followed);
                break;
            case EntityType.ANNOUNCE:
                announceFollowedState.setFollowed(id, followed);
                break;
            default:
                throw new Error("don't support this type");
        }
    }
}

export let stateManager = new StateManager();
