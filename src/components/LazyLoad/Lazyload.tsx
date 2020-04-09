import React, {PureComponent, ReactElement, ReactNode} from "react";
import LazyImage from "./LazyImage";
import classname from 'classnames';

export interface ILazyLoadProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    rootElement?: Element, /*可视区域dom节点*/
    delay?: number, /*延迟多少毫秒加载图片，默认200*/
    className?: string,
    data: any /*用于更新image的ref，当此属性变化时，img的监听才会变化*/
}

export default class LazyLoad extends PureComponent<ILazyLoadProps> {
    static Image = LazyImage;
    static displayName: string = '延迟加载组件';
    static defaultProps = {
        delay: 200
    };

    private containerDiv = React.createRef<HTMLDivElement>();
    private imgRefs: HTMLImageElement[] = [];
    private observer: IntersectionObserver | null = null;

    componentDidMount(): void {
        this.intersectionObserver();
    }

    componentDidUpdate(prevProps: Readonly<ILazyLoadProps>, prevState: Readonly<any>, snapshot?: any): void {
        if(this.props.data !== prevProps.data){
            this.intersectionObserver();
        }
    }

    /**
     * 组件卸载时释放资源
     */
    componentWillUnmount(): void {
        this.observer = null;
        this.imgRefs = [];
    }

    /**
     * 使用IntersectionObserver API监听图片显示
     * @constructor
     */
    intersectionObserver = () => {
        if(!window.hasOwnProperty('IntersectionObserver')){
            this.imgRefs.forEach(img => {
                img.src = img.dataset.src || '';
            });
            return;
        }
        //初始化监听方法
        this.observer = new IntersectionObserver((entries)=>{
            entries.forEach(item => {
                if(item.isIntersecting){
                    const img = item.target as HTMLImageElement;
                    setTimeout(()=>{
                        if(img.dataset.src){
                            img.src = img.dataset.src;
                        }
                    }, this.props.delay);
                    this.observer!.unobserve(img as Element);
                }
            });
        }, {root: this.props.rootElement || this.containerDiv.current});
        this.imgRefs.forEach(c=>{
            this.observer!.observe(c);
        });
    };

    loopChildren = (children: ReactNode): ReactNode => {
        return React.Children.map(children as ReactElement, (child => {
            /**
             * 普通img标签
             */
            if(child && child.type === 'img' && child.props && child.props['data-lazy'] === 'true'){
                return React.cloneElement(child, {
                    ref: (e: HTMLImageElement) => {
                        if(e){
                            this.imgRefs.push(e);
                        }
                    }
                });
            }
            /**
             * LvLazyImage组件
             */
            else if(child && typeof child.type === 'function' && child.type.name === LazyImage.name){
                return React.cloneElement(child, {
                    ref: (e: LazyImage) => {
                        if(e && e.imageRef && e.imageRef.current){
                            this.imgRefs.push(e.imageRef.current);
                        }
                    }
                });
            }
            else if(child && child.props && child.props.children){
                return React.cloneElement(child, {}, this.loopChildren(child.props.children));
            }
            else{
                return child;
            }
        }));
    };

    render(): React.ReactNode {
        const className = classname('lyc-lazyload', this.props.className);
        this.imgRefs = [];
        const divProps = Object.assign({}, this.props) as ILazyLoadProps;
        delete divProps.rootElement;
        delete divProps.delay;
        delete divProps.data;
        return (
            <div
                {...{
                    className,
                    ...divProps,
                    ref: this.containerDiv
                }}
            >
                {this.loopChildren(this.props.children)}
            </div>
        );
    }
}
