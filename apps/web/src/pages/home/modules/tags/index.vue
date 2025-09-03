<script lang="tsx">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { Hash } from 'lucide-vue-next';

import { useFiles } from '@/store/queries/docs/useFiles';
import { useContextStore } from '@/store/ui-states/context';

import { useHomeStore } from '@/store/ui-states/home/index';

export default defineComponent({
    setup() {
        const contextStore = useContextStore();
        const { crtSpace } = storeToRefs(contextStore);

        const { tags } = useFiles(crtSpace);

        const homeStore = useHomeStore();
        const { selectedTag } = storeToRefs(homeStore);

        const handleSelectTag = (tag: string) => {
            if (selectedTag.value === tag) {
                // 反选
                homeStore.setSelectedTag(null);
                return;
            }

            homeStore.setSelectedTag(tag);
        }

        return () => (
            <div class="tags">
                {
                    tags.value?.length ? (<div class="menuTitle mt-6">标签</div>) : ''
                }

                {
                    tags.value?.map((tag: string) => (
                        <div key={tag} class={['tag', 'flex', 'items-center', selectedTag.value === tag ? 'active' : '']} onClick={() => handleSelectTag(tag)}>
                            <Hash class="mr-2" width="14px" height="14px" />
                            {tag}
                        </div>
                    ))
                }
            </div>
        );
    }
})
</script>


<style scoped>
.tags {
    width: 240px;
    margin: 0 4px;
}

.menuTitle {
  font-size: 12px;
  font-weight: 500;
  color: #646a73;
  padding-left: 22px;
  margin-bottom: 12px;
}

.tag {
    height: 36px;
    line-height: 36px;
    padding: 0 0 0 20px;
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
    border-radius: 6px;
    transition: all .3s ease;

    &:hover {
        background: rgba(31, 35, 41, 0.08);
    }

    svg {
        color: #bbb;
    }

    &:hover {
      color: #3370ff!important;
    }

    &:hover svg {
      color: #3370ff!important;
    }

    &.active {
        font-weight: 500;
        color: #3370ff!important;
    }

    &.active svg {
        color: #3370ff!important;
    }
}
</style>