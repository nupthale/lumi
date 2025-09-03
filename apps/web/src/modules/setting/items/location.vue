<script lang="tsx">
import { defineComponent, ref, onMounted } from 'vue';
import { Button } from 'ant-design-vue';
import { FolderOpen } from 'lucide-vue-next';
import i18next from 'i18next';

export default defineComponent({
  setup() {
    const lastSelectedPath = ref('');
    const selectedPath = ref('');
    
    const handleSelectPath = async () => {
      if (!window.clientAPI) {
        console.error('clientAPI is not available');
        return;
      }

      try {
        // 调用 electron 的 IPC 来打开文件夹选择对话框
        const result = await window.clientAPI.selectDirectory();
        if (result) {
          selectedPath.value = result;
          // 保存到 electronStore
          await window.clientAPI.saveSetting({
            key: 'storagePath',
            value: result,
          });
        }
      } catch (error) {
        console.error('Failed to select directory:', error);
      }
    };

    // 初始化时从 electronStore 读取已保存的路径
    const initPath = async () => {
      if (!window.clientAPI) {
        console.error('clientAPI is not available');
        return;
      }

      try {
        const savedPath = await window.clientAPI.getSetting('storagePath');
        if (savedPath) {
          selectedPath.value = savedPath;
          lastSelectedPath.value = savedPath;
        }
      } catch (error) {
        console.error('Failed to get saved path:', error);
      }
    };

    onMounted(() => {
        // 组件挂载时初始化路径
        initPath();
    });
    

    return () => (
        <div>
            <div class="settingItem">
                <div class="settingItem__left">
                    <div class="settingItem__title">
                        {i18next.t('setting.storagePath')}
                    </div>
                    <div class="lightText text-xs mt-1.5">
                        {i18next.t('setting.storagePathDesc')}
                    </div>
                </div>
                <div class="settingItem__right">
                    <Button onClick={handleSelectPath}>
                        <div class="flex items-center">
                            <FolderOpen class="mr-2" width="16px" />
                            {i18next.t('setting.selectDirectory')}
                        </div>
                    </Button>
                </div>
            </div>
            {
                selectedPath.value ? (
                    <div class="selectedPath">
                        {selectedPath.value}
                    </div>
                ) : ''
            }

            {
                selectedPath.value !== lastSelectedPath.value? (
                    <div class="text-xs mt-2" v-html={i18next.t('setting.storageChangeWarning', {
                        path: `<span class="text-red-500 mx-2">${lastSelectedPath.value}/Lumi</span>}`
                    })}></div>
                ) : ''
            }
        </div>
    );
  }
});
</script>

<style src="../index.css"></style>

<style scoped>
.optionItem {
    width: 180px;
}

.selectedPath {
    font-size: 14px;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--float-border-color);
    background: var(--float-bg);
}
</style>