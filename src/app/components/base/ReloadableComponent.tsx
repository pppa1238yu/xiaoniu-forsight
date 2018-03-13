/**
 * Created by shangxingyu on 17-5-12.
 */
import * as React from "react";
import {ReloadableDataSource} from "../../model/ajax/DataSource";


export interface DataSourceProps<T, P extends ReloadableDataSource<T>> {
    dataSource: P;
}
export class ReloadableComponent<D, DS extends ReloadableDataSource<D>, T extends DataSourceProps<D, DS>, S> extends React.Component<T, S> {
    reloadData(params: any=null) {
        this.props.dataSource.reloadData(params);
    }
}