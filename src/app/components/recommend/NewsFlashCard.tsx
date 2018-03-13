import * as React from "react";
import {Card, CardActions, CardHeader, CardText, CardTitle} from "material-ui/Card";
import {grey700} from "material-ui/styles/colors";
export default class NewsFlashCard extends React.Component<any, any> {
    styles = {
        time:{
            paddingTop:16,
            paddingBottom:0
        },
        text: {
            fontSize:14,
            color:'#6d6d6d',
            lineHeight:'20px',
            whiteSpace: "pre-line",
        }
    };


    render() {
        return (
            <div>
                <Card>
                    <CardTitle subtitle={this.props.data.postTimestamp} style={this.styles.time}/>
                    <CardText style={this.styles.text}>
                        {this.props.data.contentText}
                    </CardText>
                </Card>
            </div>
        )
    }
}

