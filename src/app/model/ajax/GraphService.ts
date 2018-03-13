/*
export abstract class GraphDataSource extends  RefDataSource<GraphData>{
    @observable identifier:string;
    @observable name:string;
    @observable timeWindow: TimeWindow = new TimeWindow(3, TimeWindowUnit.Month);
    @observable nodeTypes:Set<string>=new Set(["ANALYST","INDUSTRY","BROKERAGE","SUBJECT","STOCK"]);
    protected onRefresh(): void {
        let paramMap = {
            identifier:this.identifier,
            name:this.name,
            maxDepth:2,
            timeWindowValue:this.timeWindow.value,
            timeWindowUnit:TimeWindowUnit[this.timeWindow.unit].toUpperCase(),
            nodeTypes:Array.from(this.nodeTypes).join(',')
        };
        http.post(this.uri, paramMap)
            .then(value => {
                this.success(value);
            })
            .catch(err => this.fail(err))
    }
    protected abstract get uri(): string;
}
export class StockGraphDataSource extends GraphDataSource {
    protected get uri(): string {
        return 'graph/stock-graph.json';
    }
}
export class AnalystGraphDataSource extends GraphDataSource {
    protected get uri(): string {
        return 'graph/analyst-graph.json';
    }

}
export let stockGraphDataSource = new StockGraphDataSource({nodes:[],edges:[]});
export let analystGraphDataSource = new AnalystGraphDataSource({nodes:[],edges:[]});
*/
