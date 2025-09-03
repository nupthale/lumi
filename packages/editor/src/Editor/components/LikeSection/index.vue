<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { UserAvatar } from '@zsfe/zsui';
import { ThumbsUp } from 'lucide';
import confetti from 'canvas-confetti';
import { i18next } from '@editor/i18n';
import { useEventListener } from '@vueuse/core';

import LucideIcon from '../LucideIcon/index.vue';
import SplashCursor from './SplashCursor.vue';

export default defineComponent({
    setup() {
        const buttonRef = ref<HTMLElement | null>(null);

        const showSplashCursor = ref(false);

        const handleClick = () => {
            if (!buttonRef.value) return;
 
            const rect = buttonRef.value.getBoundingClientRect();
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight,
                },
            });
        }

        const handleLikeMouseDown = () => {
            showSplashCursor.value = true;
        }

        useEventListener(document.body, 'mouseup', () => {
            showSplashCursor.value = false;
        }, true);

        return () => (
            <div class="likeSection" onMousedown={handleLikeMouseDown}>
                <div class="flex justify-center">
                    <div class="likeButton relative" ref={buttonRef} onClick={handleClick}>
                        <LucideIcon icon={ThumbsUp} color="#336FFF" width={22} />
                        {/* <div class="likeButton-glowing"></div> */}
                    </div>
                </div>
                <div class="mt-6 mb-2 flex items-center justify-center">
                    <div class="line"></div>
                    <div class="desc">{i18next.t('editor.likeText')}</div>
                    <div class="line"></div>
                </div>

                {
                    showSplashCursor.value ? (
                        <SplashCursor
                            SIM_RESOLUTION={128}
                            DYE_RESOLUTION={1440}
                            CAPTURE_RESOLUTION={512}
                            DENSITY_DISSIPATION={3.5}
                            VELOCITY_DISSIPATION={2}
                            PRESSURE={0.1}
                            PRESSURE_ITERATIONS={20}
                            CURL={3}
                            SPLAT_RADIUS={0.2}
                            SPLAT_FORCE={6000}
                            SHADING={true}
                            COLOR_UPDATE_SPEED={10}
                            BACK_COLOR={{ r: 0.5, g: 0, b: 0 }}
                            TRANSPARENT={true}
                        />
                    ) : ''
                }
                

                <div class="flex items-center justify-center">
                    <UserAvatar showText={false} username={i18next.t('editor.likeMyself')} />
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.likeSection {
    padding: 24px 0 130px;
    margin: 0 auto 0;
}

.likeButton {
    display: flex;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    align-items: center;
    justify-content: center;
    border: 1px solid #336FFF;
    cursor: pointer;
}

.likeButton-glowing {
    position: absolute;
    left: 0;
    top: 0;
    
    width: 120px;
    height: 120px;

    transition: all 1s ease;
    border-radius: 100%;
    /* background-image: linear-gradient(45deg,#00dc82,#36e4da,#0047e1); */
    background-image: linear-gradient(75deg, #0a357494, #a45aff82, #b6cdffd6);
    filter: blur(60px);

    transform: translate(-30px, -30px);
    opacity: 0;
}

.likeButton:hover .likeButton-glowing {
    opacity: 1;
}

.likeButton:hover {
    background: var(--float-bg-hover);
}

.likeButton:active {
    background: #c2d4ff;
}

.desc {
    color: #8f959e;
    margin: 0 7px;
    font-size: 14px;
    line-height: 20px;
    user-select: none;
}

.line {
    width: 44px;
    height: 1px;
    min-height: 1px;
}

.line:first-child {
    background: linear-gradient(to left, #dee0e3, #fff);
}

.line:last-child {
    background: linear-gradient(to right, #dee0e3, #fff);
}
</style>