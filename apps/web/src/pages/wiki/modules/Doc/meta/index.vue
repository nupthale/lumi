<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { UserAvatar } from '@zsfe/zsui';
import { storeToRefs } from 'pinia';

import { formatTime } from '@/shared/date';

import { useUserStore } from '@/store/user';

export default defineComponent({
    props: {
        doc: {
            type: Object,
            default: () => ({})
        },
        user: Object,
    },
    setup(props) {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);

        return () => (
            <div class="flex items-center lightText">
                <UserAvatar showText={false} username={user.value?.name} size="small" class="mr-2" />
                {formatTime(props.doc?.contentUpdatedAt)} 修改
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