/**
 * 按条件树结构中某一个item的层级关系
 * @param array
 * @param filter
 * @param childrenKey
 */
export const $getItemTree = <T=any>(array: T[], filter: (item: T)=>boolean, childrenKey:string = 'children'): T[] => {
    let list: T[] = [];
    let isFind = false;

    array.forEach(c=>{
        //@ts-ignore
        c.isTop = true;
    });

    const loop = (data: T[]) => {
        if (isFind) {return false;}
        for(let m of data){
            if (isFind) {break;}
            // 如果重新查找了一个顶级菜单，清空掉list
            // @ts-ignore
            if(m.isTop){
                list = [];
            }
            // @ts-ignore
            let _children = m[childrenKey] || [];
            if(filter(m)){
                // 找到了对应的末级了，退出递归
                // @ts-ignore
                list.push(m);
                isFind = true;
                break;
            }
            else if(_children &&_children.length > 0){
                // 还有子集，继续递归
                list.push(m);
                loop(_children);
            }
            else{
                // 没有子集了，也没有找到对应的末级，继续循环

            }
        }
    };

    loop(array);
    return list;
};

/**
 * 获取树结构中符合filter的item
 * @param datasource
 * @param filter
 * @param childKey
 */
export const loopDataTree = <T = any>(datasource: T[], filter: (o: T) => boolean, childKey: string = 'children'): T[] => {
    let result: T[] = [];
    for (let i = 0; i < datasource.length; i++) {
        const item = datasource[i];
        // @ts-ignore
        const _children: T[] = item[childKey] as T[] || [];
        if (filter(item)) {
            result.push(item);
            break;
        } else if (_children.length > 0) {
            result = result.concat(loopDataTree(_children, filter, childKey));
        }
    }
    return result;
};
