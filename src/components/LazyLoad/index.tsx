/**
 * 延迟加载容器
 * 作用：
 *      容器内的img标签会通过设定的rootElement可视区域来进行延迟加载
 * 使用方法：
 *      1)将容器内的img标签添加自定义属性data-lazy="true"并且设置data-src属性为资源url
 *      2）或者使用LvLazyImage组件，容器内的LvLazyImage组件将会延迟加载
 */
import React, {PureComponent, ReactElement, ReactNode} from 'react';
import LazyImage from './LazyImage';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    rootElement?: Element, /*可视区域dom节点*/
    delay?: number, /*延迟多少毫秒加载图片，默认200*/
    data: any /*用于更新image的ref，当此属性变化时，img的监听才会变化*/
}

export default class LazyLoad extends PureComponent<IProps> {
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

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<any>, snapshot?: any): void {
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
        this.imgRefs = [];
        const divProps = Object.assign({}, this.props) as IProps;
        delete divProps.rootElement;
        delete divProps.delay;
        delete divProps.data;
        return (
            <div
                {...{
                    ...divProps,
                    ref: this.containerDiv
                }}
            >
                {this.loopChildren(this.props.children)}
            </div>
        );
    }
}
