/**
 * 延迟加载容器
 * 作用：
 *      容器内的img标签会通过设定的rootElement可视区域来进行延迟加载
 * 使用方法：
 *      1)将容器内的img标签添加自定义属性data-lazy="true"并且设置data-src属性为资源url
 *      2）或者使用LvLazyImage组件，容器内的LvLazyImage组件将会延迟加载
 */
import Lazyload from './Lazyload';
export {ILazyLoadProps} from './Lazyload';
export {ILazyImageProps} from './LazyImage';
export default Lazyload;

