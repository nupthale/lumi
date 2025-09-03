import { Node } from 'prosemirror-model';

import numberToLetter from 'number-to-letter';
import romanNumerals from 'roman-numerals';

import { EditorState, Transaction } from 'prosemirror-state';
import { getRangeByNode } from '@editor/Editor/shared';

const toRoman = romanNumerals.toRoman;
/**
 * 根据indexArray[]转换为显示的index
 * 第一层显示1, 2, 3, 4, 5, 6, 7, 8, 9
 * 第二层显示a, b, c, d, e, f, g, h, i....aa, ab, ac, ad, ae, af, ag, ah, ai....
 * 第三层显示阿拉伯数字
 * /

import numberToLetter from 'number-to-letter';
import { toRoman } from 'roman-numerals';

/**
 * 根据indexArray[]转换为显示的index， 这个层数意思是数组的长度
 * 第一层显示1, 2, 3, 4, 5, 6, 7, 8, 9
 * 第二层显示a, b, c, d, e, f, g, h, i....aa, ab, ac, ad, ae, af, ag, ah, ai....
 * 第三层显示阿拉伯数字
 * 
 * 第四层和第一层显示一致
 * 第五层和第二层显示一致
 * 第六层和第三层显示一致
 * 依次类推
 */
export const getOrderedIndex = (indexArray: number[]) => {
    if (!indexArray?.length) {
        return '';
    }

    const layer = indexArray.length % 3;
    const lastNumber = indexArray[indexArray.length - 1];

    if (layer === 1) {
        // 1对应的是1
        return lastNumber;
    }
    
    if (layer === 2) {
        // 0对应的是A
        return numberToLetter(lastNumber - 1).toLowerCase();
    }

    if (layer === 0) {
        // 1对应的是i
        return toRoman(lastNumber).toLowerCase();
    }
}

export const updateAttributeDeep = (
    nodes: readonly Node[], 
    matchNodeType: string, 
    attrName: string, 
    attrValue: any,
    state: EditorState,
    tr: Transaction,
) => {
    nodes.forEach(node => {
        if (node.type.name === matchNodeType) {
            const [from] = getRangeByNode(state, node);
            tr.setNodeAttribute(from, attrName, attrValue);
        }

        if (node.children?.length) {
            updateAttributeDeep(node.children, matchNodeType, attrName, attrValue, state, tr);
        }
    });
}