import { tap } from 'rxjs';
import { Document, IndexedDB } from 'flexsearch';

import { updateFileSearchIndex$ } from './event';

// create DB instance with namespace
const db = new IndexedDB('lumi-searchdb');

// create the document index
export let searchIndex = new Document({
    document: {
        id: "fileId",
        store: true,
        index: [{
            field: "content",
            tokenize: "forward",
            encoder: "LatinBalance",
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
        console.error('Failed to mount search index:', e);
    } 
}

mountSearchIndex();

// 需要索引的是： 文档内容、collection的value、collection的标题
updateFileSearchIndex$.pipe(
    tap(async ({ fileId, docText, collectionsText }) => {
        if (!isMounted) {
            console.warn('Search index not ready, skipping indexing');
            return;
        }

        try {
            await searchIndex.add({
                fileId,
                content: docText + '\n' + collectionsText?.join(' '),
            });
            
            console.log(`Successfully indexed file ${fileId} and exported to IndexedDB`);
        } catch(e) {
            console.error('Failed to index file:', fileId, e);
        }
        
    })
).subscribe();
