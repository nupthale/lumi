<script lang="tsx">
import { defineComponent, PropType, provide } from 'vue';

import { CollectionSchemaType, ViewEnum } from '@collection/interface';

import CollectionView from './views/index.vue';

export default defineComponent({
  props: {
    id: String,
    schema: Object as PropType<CollectionSchemaType>,
    values: Array as PropType<Record<string, any>[]>,
  },
  setup(props) {
    provide('id', props.id);

    return () => (
      <div class="collection">
        <CollectionView schema={props.schema} values={props.values} />
      </div>
    );
  }
});
</script>

<style scoped>
.collection {
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,Tahoma,PingFang SC,Microsoft Yahei,Arial,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  color: var(--text-color);
}
</style>