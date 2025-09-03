<script lang="tsx">
import { defineComponent, PropType, inject } from 'vue';

import Grid from './GridView/index.vue';
import Gallery from './GalleryView/index.vue';

import DetailDrawer from '@collection/views/common/modules/detailDrawer/index.vue';
import { CollectionSchemaType, ViewEnum } from '@collection/interface';

import Header from './common/modules/header/index.vue';

export default defineComponent({
  props: {
    schema: Object as PropType<CollectionSchemaType>,
    values: Array as PropType<Record<string, any>[]>,
  },
  setup(props) {
    const id = inject<string>('id');

    const renderView = () => {
      const viewId = props.schema?.viewId;
      const viewType = props.schema?.views.find(view => view.id === viewId)?.type;

      if (viewType === ViewEnum.GRID) {
        return (<Grid schema={props.schema} values={props.values} />);
      }

      if (viewType === ViewEnum.GALLERY) {
        return (<Gallery schema={props.schema} values={props.values} />);
      }

      return 'unknown view';
    }

    return () => (
      <div class="zsui-collection">
        <Header schema={props.schema} />

        {renderView()}

        <DetailDrawer id={id} schema={props.schema} />
      </div>
    );
  }
});
</script>

<style scoped>
.zsui-collection {
  font-family: "Styrene Display", sans-serif -apple-system,BlinkMacSystemFont,Helvetica Neue,Tahoma,PingFang SC,Microsoft Yahei,Arial,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  color: var(--text-color);
}
</style>