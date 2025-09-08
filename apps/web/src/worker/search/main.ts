import { tap } from 'rxjs';
import { Document, IndexedDB } from 'flexsearch';

import { updateFileSearchIndex$ } from './event';

// create DB instance with namespace
const db = new IndexedDB('lumi-searchdb');

// create the document index
export const searchIndex = new Document({
    // worker: true,
    document: {
        id: "fileId",
        store: true,
        index: [{
            field: "docText",
            tokenize: "forward",
            encoder: "LatinBalance"
        },{
            field: "collectionsText",
            tokenize: "forward",
            encoder: "LatinBalance"
        }],
    }
});

let isMounted = false;

async function mountSearchIndex() {
    if (isMounted) {
        return;
    }

    try {
        await searchIndex.mount(db);

        isMounted = true;
    } catch(e) {
        console.error(e);
    } 
}

mountSearchIndex();

// 需要索引的是： 文档内容、collection的value、collection的标题
updateFileSearchIndex$.pipe(
    tap(async ({ fileId, docText, collectionsText }) => {
        if (!isMounted) return;

        try {
            await searchIndex.add({
                fileId,
                docText,
                collectionsText,
            });
        } catch(e) {
            console.error(e);
        }
        
    })
).subscribe();
