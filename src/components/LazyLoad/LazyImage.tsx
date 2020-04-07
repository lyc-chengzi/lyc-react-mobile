import React, {PureComponent} from 'react';

interface IProps extends React.DetailsHTMLAttributes<HTMLImageElement>{
    'data-src': string,
    alt?: string,
}

export default class LazyImage extends PureComponent<IProps>{
    public imageRef = React.createRef<HTMLImageElement>();
    render(): React.ReactNode {
        return (
            <img alt='' {...this.props} ref={this.imageRef} />
        );
    }
}
