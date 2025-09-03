<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { ChevronsRight, ThumbsUp } from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { Tooltip } from 'ant-design-vue';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { Vue3Marquee } from 'vue3-marquee'

import { commentStore  } from '../../store/comment';
import UserGroup from '../UserGroup/index.vue';
import { docLikesChange$, ydocPersistenceSync$, ydocProviderSync$ } from '@editor/Editor/event';

import { getTotalLikesCount, getLikesUsers, syncLikeCountToRemote } from '@editor/Editor/plugins/collab/likes';
import { useUserStore } from '@editor/Editor/store/user';

export default defineComponent({
    props: {
        fileId: String,
    },
    setup(props) {
        const { user } = useUserStore();

        const likesCount = ref(0);
        const likeUsers = ref<{ id: string, name: string }[]>([]);
        const isLiked = ref(false);

        const buttonRef = ref<HTMLElement | null>(null);

        const updateIsLiked = () => {
            const likedUserIds = likeUsers.value?.map(user => user.id);
            isLiked.value = likedUserIds.includes(user.value!.id);
        }

        const handleLikeClick = () => {
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

            syncLikeCountToRemote(props.fileId!, user.value!.id, user.value!.name);

            likesCount.value = getTotalLikesCount(props.fileId!);
        }

        const update = () => {
            if (!user.value?.id) {
                return;
            }

            likesCount.value = getTotalLikesCount(props.fileId!);

            const users = getLikesUsers(props.fileId!);
            const newUserIds = users.map(user => user.id);
            const crtUserIds = likeUsers.value?.map(item => item.id);

            if (!isEqual(newUserIds, crtUserIds)) {
                likeUsers.value = users.map(user => {
                    return {
                        id: user.id,
                        name: user.username,
                    };
                }) || [];
            }

            updateIsLiked();
        }

        useSubscription(
            docLikesChange$.pipe(
                filter(({ fileId }) => fileId === props.fileId),
                tap(() => {
                    update();
                })
            ).subscribe()
        );

        useSubscription(
            ydocPersistenceSync$.pipe(
                filter(({ fileId }) => fileId === props.fileId),
                tap(() => {
                    update();
                })
            ).subscribe()
        );

        useSubscription(
            ydocProviderSync$.pipe(
                filter(({ fileId }) => fileId === props.fileId),
                tap(() => {
                    update();
                })
            ).subscribe()
        );

        return () => (
            <div>
                <div class="flex items-center justify-between px-3 mb-2">
                    <div class="flex items-center gap-4" ref={buttonRef}>
                        <TextButton type="primary" class="-ml-1"  onClick={handleLikeClick}>
                            <div class="flex items-center gap-2">
                                {
                                    isLiked.value ? (
                                        <ThumbsUp size={18} color="#ffc60a" fill="#ffc60a" />
                                    ) : (
                                        <ThumbsUp size={18} color="#336fff" />
                                    )
                                }
                                
                                {
                                    likesCount.value ? (
                                        <span class="lightText">{likesCount.value}</span>
                                    ) : ''
                                }
                            </div>
                        </TextButton>
                    </div>

                    <Tooltip title={i18next.t('editor.comment.foldPanel')} placement='left'>
                        <TextButton size="small" style="color: var(--text-color)" onClick={() => commentStore.getState().toggleCommentsVisible()}>
                            <ChevronsRight width={18} />
                        </TextButton>
                    </Tooltip>
                </div>
                {
                    likesCount.value ? (
                        <div class="px-3 mb-3 lightText">
                            <Vue3Marquee duration={6 * (likeUsers.value?.length || 0)}>
                                {
                                    likeUsers.value?.map(user => (
                                        <div style="color: #8f959e;" class="mr-2" key={user.id}>
                                            {i18next.t('editor.thumbsUp', {
                                                user: likeUsers.value?.[likeUsers.value?.length - 1].name
                                            })}
                                        </div>
                                    ))
                                }
                            </Vue3Marquee>
                            
                            <div class="doc-likeUsers">
                                <UserGroup size="small" users={likeUsers.value} maxCount={8} />
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        );
    }
});
</script>

<style scoped>
.doc-likeUsers {
    margin-top: 8px;
}

.doc-likeUsers :deep(.ant-avatar-string) {
    transform: scale(0.8) translateX(-50%)!important;
}

.doc-likeUsers :deep(.zsui-user) {
    height: 20px!important;
}

.doc-likeUsers :deep(.more) {
    width: 20px!important;
    height: 20px!important;
}
</style>