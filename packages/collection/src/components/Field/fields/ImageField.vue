<script lang="tsx">
import { defineComponent, PropType, inject, toRef } from 'vue';
import { Button, message } from 'ant-design-vue';
import { Plus, LoaderCircle } from 'lucide-vue-next';

import { ColumnType, ImageColumnType, FileType } from '@collection/interface';
import { themeTokens } from '@collection/shared/theme';

import { useUpload } from '../hooks/useUpload';

export default defineComponent({
    props: {
        rowId: String,
        column: Object as PropType<ColumnType & ImageColumnType>,
        value: {
            type: Array as PropType<FileType[]>,
        },
        showPlaceholder: Boolean,
    },
    setup(props) {
        const id = inject<string>('id')!;

        const rowIdRef = toRef(props, 'rowId');
        const columnRef = toRef(props, 'column');

        const { uploadCellFile } = useUpload(
            id,
            rowIdRef!, 
            columnRef!, 
        );

        const handleUpload = (e: Event) => {
            uploadCellFile(e);
        }

        return () => (
            <div
                class="imageEdit flex items-start gap-1 w-full"
            >
                <Button class="uploadBtn relative overflow-hidden !cursor-pointer" size="small">
                    <div class="flex items-center">
                        <Plus class="flex-shrink-0 -ml-1" width={12} height={12} />
                        <input type="file" class="absolute !opacity-0 w-[800px] h-[800px] top-0 left-0 !cursor-pointer" accept="image/*" onChange={handleUpload} />
                    </div>
                </Button>

                <div class="flex items-center flex-wrap gap-1">
                    {
                        props.value?.map(image => (
                            <div class="imageThumb" style={{ backgroundImage: !image.uploading ? `url(${image?.url})` : 'none' }}>
                                {
                                    image.uploading ? (
                                        <svg class="animate-spin" style={{ width: '12px', height: '12px', color: themeTokens.primaryTextColor()}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        null
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
})
</script>

<style scoped>
.imageEdit {
    min-height: 20px;
}

.uploadBtn {
    width: 20px;
    height: 20px;
}

.imageThumb {
    display: flex; 
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 20px;
    border-radius: 4px;
    background-size: cover;
    cursor: pointer;
    transition: all .1s ease;
    background-color: var(--image-active-bg);
}

.imageThumb:hover {
    transform: scale(1.2);
}
</style>