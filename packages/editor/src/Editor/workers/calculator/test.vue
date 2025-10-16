<script lang="tsx">
import { defineComponent } from 'vue';

import Worker from './index.ts?worker';

const worker = new Worker();

worker.onmessage = (e) => {
    console.info(e);
}

export default defineComponent({
    setup() {
        return () => (
            <div>
                <button onClick={() => {
                    worker.postMessage({
                        type: 'GET_COLLECTIONS', 
                        fileId: '1756969814385_o2GXS25f',
                    });
                }}>
                    Click me
                </button>
            </div>
        );
    }
})

</script>