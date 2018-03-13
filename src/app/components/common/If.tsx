import * as React from 'react';

interface Props {
    condition: boolean;
    block?: boolean;
}

export default class If extends React.Component<Props, null> {

    render() {
        if (this.props.condition) {
            if (this.props.block) {
                return <div>{this.props.children}</div>;
            }
            return <div style={{display: 'inline-block'}}>{this.props.children}</div>;
        }
        return null;
    }
}