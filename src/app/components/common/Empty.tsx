import * as React from "react";

import {
    blue400,
    greenA200,
    grey500,
    grey600,
    pinkA200,
    red500,
    transparent,
    yellow600
} from "material-ui/styles/colors";

export class CustomEmpty extends React.Component<any, any> {

    render() {
        const style = this.props.styleContainer;
        return this.props.mobile ?
            (
                <div style = {style}>
                    <Empty4Mobile {...this.props} />
                </div>
            ) :
            (
                <div style = {style}>
                    <Empty4Desktop {...this.props}/>
                </div>
            );

    }
}

interface EmptyProps {
    label?: string;
    mobile?: boolean;
    imageLink?: string;
}
export default class Empty extends React.Component<EmptyProps, any> {
    //简单指定，考虑 window.innerHeight

    render() {

        return this.props.mobile ?
            (
                <Empty4Mobile {...this.props}/>
            ) :
            (
                <Empty4Desktop {...this.props}/>
            );
    }

}

class Empty4Mobile extends React.Component<EmptyProps, any> {
    styles = {
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        imageContainer: {
            margin: '0 auto',
            textAlign: 'center',
        },
        image: {
            height: 230,
            width: 230,
        },
        textContainer: {
            paddingTop: 16,
            paddingLeft: 24,
            paddingRight: 24,

        },
        text: {
            fontSize: 22,
            color: grey500,
        },
    };

    render() {
        const link = this.props.imageLink || '/images/result.png';
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.imageContainer}>
                    <img src={link} style={this.styles.image as any}/>
                    {this.props.label == undefined ?
                        <div style={this.styles.textContainer}>
                            <span style={this.styles.text}>无结果，请重新选择</span>
                        </div> :
                        <div style={this.styles.textContainer}>
                            <span style={this.styles.text}>{this.props.label}</span>
                        </div>
                    }
                </div>
                <div style={this.styles.after}/>
            </div>
        )
    }
}

class Empty4Desktop extends React.Component<EmptyProps, any> {
    styles = {
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            flexFlow: 'column',
            flexGrow: 1,
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 2,
            content: '',
            display: 'block',
        },
        imageContainer: {
            width: 450,
            margin: '0 auto',
            textAlign: 'center',
        },
        image: {
            height: 200,
            width: 200,
        },
        textContainer: {
            paddingTop: 24,
        },
        text: {
            fontSize: 28,
            color: grey500,
        },
    };

    render() {
        const link = this.props.imageLink || '/images/result.png';

        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.imageContainer}>
                    <img src={link} style={this.styles.image as any}/>
                    {this.props.label == undefined ?
                        <div style={this.styles.textContainer}>
                            <span style={this.styles.text}>无结果，请重新选择</span>
                        </div> :
                        <div style={this.styles.textContainer}>
                            <span style={this.styles.text}>{this.props.label}</span>
                        </div>
                    }
                </div>
                <div style={this.styles.after}/>
            </div>
        )
    }

}

