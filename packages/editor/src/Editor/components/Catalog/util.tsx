export const getText = (content) => {
    return content?.reduce((acc, crt) => {
        if (crt.type === 'emoji') {
            return acc + crt.content?.[0]?.text;
        } else if (crt.type === 'text') {
            return acc + crt.text;
        } else if (crt.type === 'mention') {
            return acc + `@${crt.attrs.name}`;
        }
        
        return acc;
    }, '') || '';
}

/**
 * toTree函数功能： 实现目录缩进计算，以及父子关系维护功能， 返回一个扁平的结构
 * @param id: 节点id
 * @param level: 层级， 代表h1-h6中的1-6
 * @param text: 标题内容
 * @param indent: 缩进值 - 首先所有节点最小的level，最小level的indent为0, 然后依次递增
 *                计算方法：
 *                1. 首先所有节点最小的level，最小level的indent为0
 *                2. 计算第二小level， 第二小level的indent为1
 *                3. 计算第三小level， 第三小level的indent为2
 *                4. 以此类推
 *                
 *                用例如下：
 *                如果连续h1-h2-h3， h1的indent为0, 则h2的indent为1， h3的indent为2
 *                如果h3-h3-h5， h3的indent为0, h3的indent为0, h5的indent为1
 *                如果h1-h3-h4， h1的indent为0, h3的indent为1, h4的indent为2
 *                如果h1-h2-h4， h1的indent为0, h2的indent为1, h4的indent为2
 *                如果h1-h3-h2， h1的indent为0, h3的indent为2, h2的indent为1
 *                如果h1-h3-h5， h1的indent为0, h3的indent为1, h5的indent为2
 * @param parentId: 紧邻的父节点id
 * 
 * 输入一个数组， 结构如下：
 * [
 *  { id: 1, level: 1, text: '标题1' },
 *  { id: 2, level: 3, text: '标题3-1' },
 *  { id: 3, level: 4, text: '标题4' },
 *  { id: 4, level: 3, text: '标题3-2' },
 * ]， 返回扁平的结构如下：
 * [
 *  { id: 1, level: 1, text: '标题1', indent: 0, parentId: null }
 *  { id: 2, level: 3, text: '标题3-1', indent: 1, parentId: 1 },
 *  { id: 3, level: 4, text: '标题4', indent: 2, parentId: 2 },
 *  { id: 4, level: 3, text: '标题3-2', indent: 1, parentId: 1 },
 * ]
 */
export interface Node {
    id: string;
    level: number;
    text: string;
    indent: number;
    parentId: string | null;
}

export interface InputNode {
    id: string;
    level: number;
    text: string;
}

export const toTree = (nodes: InputNode[]): Node[] => {
    if (!nodes.length) return [];
    
    // 创建一个Set来存储所有出现过的level值
    const levelSet = new Set<number>();
    nodes.forEach(node => levelSet.add(node.level));
    
    // 将level值排序，用于计算indent
    const sortedLevels = Array.from(levelSet).sort((a, b) => a - b);
    
    // 创建level到indent的映射
    const levelToIndent = new Map<number, number>();
    sortedLevels.forEach((level, index) => {
        levelToIndent.set(level, index);
    });
    
    const result: Node[] = [];
    
    // 处理每个节点，计算indent和parentId
    for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        const indent = levelToIndent.get(currentNode.level) || 0;
        
        // 寻找父节点
        let parentId: string | null = null;
        
        // 从当前节点向前查找，找到第一个level小于当前节点level的节点作为父节点
        for (let j = i - 1; j >= 0; j--) {
            if (nodes[j].level < currentNode.level) {
                parentId = nodes[j].id;
                break;
            }
            
            // 如果前面的节点level等于当前节点level，则它们共享同一个父节点
            if (nodes[j].level === currentNode.level) {
                // 找到这个同级节点的父节点
                const sameParentId = result[j].parentId;
                parentId = sameParentId;
                break;
            }
        }
        
        result.push({
            ...currentNode,
            indent,
            parentId
        });
    }
    
    return result;
};


