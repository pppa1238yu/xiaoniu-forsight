import * as React from "react";
export default class Nodata extends React.Component<any, any> {
    styles = {
      minHeight:{
          minHeight:120
      }
    };
    render() {
        return (
            <div className="flexCenter" style={this.styles.minHeight}>
                <p className="centerText">暂无数据</p>
            </div>
        )
    }
}