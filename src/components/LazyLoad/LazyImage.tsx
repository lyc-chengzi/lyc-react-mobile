import React, {PureComponent} from 'react';

export interface ILazyImageProps extends React.DetailsHTMLAttributes<HTMLImageElement>{
    'data-src': string,
    alt?: string,
}

export default class LazyImage extends PureComponent<ILazyImageProps>{
    public imageRef = React.createRef<HTMLImageElement>();
    render(): React.ReactNode {
        return (
            <img alt='' {...this.props} ref={this.imageRef} />
        );
    }
}
