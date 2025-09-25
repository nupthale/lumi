<script lang="tsx">
import { defineComponent, ref, onMounted, onUnmounted, watch, toRef, computed } from 'vue';
import Granim from 'granim';
import { Laugh, Wallpaper, Frown } from 'lucide-vue-next';
import i18next from 'i18next';

import { events } from '@/database/index';

import fallbackBanner from '@/assets/fallback_banner.png';

import Emoji from './Emoji.vue';

export default defineComponent({
  props: {
    file: Object,
  },
  setup(props) {
    const fileRef = toRef(props, 'file');

    const imageLoaded = ref(false);
    const imageSrc = ref('');
    const canvasEl = ref();
    let granimRef = ref();

    const emoji = ref();

    const getNewCover = async () => {
      const initialUrl = 'https://picsum.photos/4855/1803';
    
      try {
          imageLoaded.value = false;

          const response = await fetch(initialUrl);
          const responseUrl = response.url;
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          
          imageSrc.value = blobUrl; // 保存最终 URL
          setTimeout(() => {
            imageLoaded.value = true;
          }, 100);

          return responseUrl;
      } catch (error) {
          console.error('获取图片失败:', error);
      }
    }

    const getCover = async (url: string) => {
      try {
          imageLoaded.value = false;

          const response = await fetch(url);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          imageLoaded.value = true;
          imageSrc.value = blobUrl;
      } catch (error) {
          console.error('获取图片失败:', error);
      }
    }

    const createAndSaveCover = async () => {
        try {
          imageLoaded.value = false;

          const url = await getNewCover();

          events.fileUpdated({
            id: fileRef.value?.fileId,
            cover: url,
          });

          return url;
        } catch(e) {
          console.error(e);
        }
    }

    const handleChangeEmoji = async (e) => {
      try {
        emoji.value = e;

        events.fileUpdated({
            id: fileRef.value?.fileId,
            emoji: e,
        });
      } catch(e) {
        console.error(e);
      }
    }

    const crtCoverRef = ref();
    watch(fileRef, async () => {
      if (!fileRef.value) return;

      if (fileRef.value?.cover !== crtCoverRef.value) {
        if (!fileRef.value?.cover) {
          crtCoverRef.value = await createAndSaveCover();
        } else {
          getCover(fileRef.value?.cover);
          crtCoverRef.value = fileRef.value?.cover;
        } 
      }
      
      if(fileRef.value?.emoji !== emoji.value) {
        emoji.value = fileRef.value?.emoji;
      }
    }, {
      immediate: true,
    });

    const granim = () => {
      granimRef.value = new Granim({
        element: canvasEl.value as HTMLCanvasElement,
        opacity: [0, 1],
        direction: 'radial',
        states : {
          "default-state": {
            gradients: [
                ['#F9EEEB', '#F2F3EE'],  // 淡粉米色到淡绿
                ['#EAF8F4', '#EBFAF2'],  // 淡青色到淡绿
                ['#F0EFF9', '#EEF2F9'],  // 淡紫色到淡蓝
                ['#F9F5EA', '#F4F9EC']   // 淡黄色到淡绿
            ]
          }
        }
      });
    }

    onMounted(() => {
      granim();
    });

     // 当组件卸载时，记得释放 blob URL
     onUnmounted(() => {
        URL.revokeObjectURL(imageSrc.value);

        if (granimRef.value) {
          granimRef.value?.destroy();
        }
     });

    return () => (
      <>

        <div class="header relative h-[320px] bg-cover bg-center" style={{ backgroundColor: '#f5f6f7' }}>
          <canvas class="absolute left-0 top-0 w-full h-full z-2" ref={canvasEl} style={{ display: imageLoaded.value ? 'none' : 'block' }}></canvas>
          
          {
            imageLoaded.value ? (
              <div class="absolute left-0 top-0 header-bg w-full h-full bg-cover bg-center fade-in" style={{ backgroundImage: imageSrc.value ? `url(${imageSrc.value})` : fallbackBanner}}></div>
            ) : ''
          }

          <div class="flex items-center justify-between w-[820px] h-[68px] absolute left-0 right-0 top-[248px] mx-auto">
            <div class="">
              <Emoji emoji={emoji.value} onChange={handleChangeEmoji} />
            </div>

            <div class="header-actions overflow-hidden">
              <div class="header-actions_inner flex items-center justify-end gap-4">
                {
                  emoji.value ? (
                    <div class="header-action" onClick={() => handleChangeEmoji('')}>
                      <Frown size={16} class="mr-2" />
                      {i18next.t('doc.banner.removeEmoji')}
                    </div>
                  ) : (
                    <div class="header-action" onClick={() => handleChangeEmoji('💯')}>
                      <Laugh size={16} class="mr-2" />
                      {i18next.t('doc.banner.addEmoji')}
                    </div>
                  )
                }
                
                <div class="header-action" onClick={() => createAndSaveCover()}>
                  <Wallpaper size={16} class="mr-2" />
                  {i18next.t('doc.banner.switchBanner')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
});
</script>

<style lang="less" scoped>
.navLine {
    margin: 0 16px;
    width: 1px;
    height: 32px;
    background: #dee0e3;
}

.header {
  z-index: 12;
}

.doc-head {
   position: absolute;
   width: 820px;

   top: calc(320px - 30px);
   left: 300px;

   width: 60px;
   height: 60px;

   font-size: 56px;
}

.header-action {
  display: flex;
  align-items: center;

  font-size: 12px;
  color: #fff;
  padding: 5px 18px;
  cursor: pointer;
  background: rgba(31,35,41,.6);
  border: 1px solid hsl(0deg 0% 89.87% / 80%);
  border-radius: 4px;
  user-select: none;

  &:hover {
    background: rgba(31,35,41,.8);
  }
}

.header-bg {
  background-size: 100%; 
  opacity: 0;
  // transform-origin: center;
  // transition: background-size 0.4s ease-in-out;
  // will-change: background-size;
  transition: opacity 1s ease;
}

.fade-in {
  animation: fadeIn 0.6s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.header:hover .header-bg {
  // background-size: 102%;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-actions_inner {
  opacity: 0;
  transform: translateY(50px);
  transition: all .2s ease-in-out;
}

.header:hover .header-actions_inner {
  opacity: 1;
  transform: translateY(0);
}
</style>