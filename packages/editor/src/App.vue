<script lang="tsx">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { message } from 'ant-design-vue';

import EditorComponent from './EditorComponent/index.vue';

message.config({
  maxCount: 1,
});

export default defineComponent({
  setup() {
    return () => (
      <div class="w-full h-full">
        <EditorComponent />
      </div>
    );
  }
});
</script>