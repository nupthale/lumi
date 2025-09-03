<script lang="tsx">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { UserProfile, UserAvatar } from '@zsfe/zsui';

import Tags from './tags.vue';

export default defineComponent({
    props: {
        doc: {
            type: Object,
            default: () => ({})
        },
        user: Object,
        store: Object,
        allTags: Array as PropType<string[]>,
    },
    setup(props) {
        const creator = computed(() => {
            return props.doc?.creator;
        });

        const renderUser = () => {
            if (!creator?.value?.name) return '';

            return (
                <div class="flex items-center">
                    <UserProfile username={creator?.value?.name}>
                        {{
                            user: () => (
                                <div class="inline-flex items-center">
                                    <UserAvatar size="small" username={creator?.value?.name} showText={false} />
                                    <span class="ml-1 text-sm text-[#646a73]">{creator?.value?.name}</span>
                                </div>
                            ),
                            profile: () => (
                                <div class="p-[15px]">
                                    你好， 欢迎访问我的主页
                                </div>
                            ),
                        }}
                    </UserProfile>

                    <div class="divider"></div>
                </div>
            );
        };

        return () => (
            <div class="flex items-center">
                <Tags 
                    initialTags={props.doc?.tags} 
                    doc={props.doc} 
                    user={props.user} 
                    store={props.store} 
                    allTags={props.allTags} 
                />
            </div>
        );
    }
});
</script>

<style scoped>
.divider {
    background: #dee0e3;
    width: 1px;
    margin: 3px 12px;
    height: 14px;
}
</style>