import * as React from "react";
import {ReactText} from "react";
import {observable} from "mobx";
import {Util} from "../../Constants";

const VALID_COLUMN_COUNTS = [1, 2, 3, 4, 6, 12];
const DEFAULT_TOTAL_WIDTH_PERCENTAGE = 0.85;
const DEFAULT_ITEM_PADDING = 0;

export interface GridLayoutProps<E> {
    dataSource: Array<E>;
    keyExtractor: (E) => ReactText;
    itemRender: (E,index) => JSX.Element;
    headerRender?: () => JSX.Element;
    footerRender?: () => JSX.Element;
    itemBasis: number;
    itemHeight?: string;
    itemPaddingVertical?: number;
    itemPaddingHorizontal?: number;
    totalWidthPercentage?: number;
}

// React不支持带泛型的Component，请派生后再重用
// 注意：派生后请加@observer
export abstract class GridLayout<E> extends React.Component<GridLayoutProps<E>, null> {

    @observable private contentWidth: number;

    private resizingHandler = () => { this.contentWidth = Util.contentWidth(window.innerWidth); }

    styles = {
        whole: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        grid: {
            boxSizing: 'content-box',
            display: 'flex',
            alignItems: 'start',
            flexWrap: 'wrap'
        },
        space: {
            flexGrow: 1,
        },
        gridItem: {
            boxSizing: 'border-box',
            width: this.props.itemBasis,
            height: this.props.itemHeight,
            paddingLeft: this.props.itemPaddingHorizontal / 2 || 0,
            paddingRight: this.props.itemPaddingHorizontal / 2 || 0,
            paddingTop: this.props.itemPaddingVertical / 2 || 0,
            paddingBottom: this.props.itemPaddingVertical / 2 || 0,
        },
        header: {
            padding: 0,
        },
        footer: {
            padding: '8px 0 0',
        }
    };

    constructor(props: GridLayoutProps<E>, context?: any) {
        super(props, context);
        this.resizingHandler();
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizingHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizingHandler);
    }

    render() {
        let columnCount = this.determineColumnCount();
        let rowCount = Math.floor(this.props.dataSource.length + columnCount - 1) / columnCount;
        let requiredWidth = this.props.itemBasis * columnCount;
        let header: JSX.Element = null, footer: JSX.Element = null;

        if (this.props.headerRender) {
            header =
                <div style={{...this.styles.header, width: requiredWidth + 'px'}}>
                    {this.props.headerRender()}
                </div>;
        }
        if (this.props.footerRender) {
            footer =
                <div style={{...this.styles.footer, width: requiredWidth + 'px', paddingLeft: this.props.itemPaddingHorizontal / 2 || 0, paddingRight: this.props.itemPaddingHorizontal / 2 || 0,}}>
                    {this.props.footerRender()}
                </div>;
        }
        return (
            <div style={this.styles.whole as any}>
                {header}
                <div style={{...this.styles.grid as any, width: requiredWidth}}>
                    {
                        this.props.dataSource.map((item,index) =>
                            <div key={this.props.keyExtractor(item)} style={this.styles.gridItem}>
                                {this.props.itemRender(item,index)}
                            </div>
                        )
                    }
                </div>
                <div style={this.styles.space}/>
                {footer}
            </div>
        );
    }

    private determineColumnCount(): number {
        let totalWidth = this.contentWidth * (this.props.totalWidthPercentage || DEFAULT_TOTAL_WIDTH_PERCENTAGE);
        let uglyCount = Math.floor(totalWidth / this.props.itemBasis);
        for (let i = VALID_COLUMN_COUNTS.length - 1; i >= 0; --i) {
            let prettyCount = VALID_COLUMN_COUNTS[i];
            if (prettyCount <= uglyCount) {
                return prettyCount;
            }
        }
        return 1;
    }
}