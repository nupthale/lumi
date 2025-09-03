<script lang="tsx">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { AvatarGroup, Tooltip, Dropdown } from 'ant-design-vue';
import { UserAvatar } from '@zsfe/zsui';
import { Ellipsis } from 'lucide-vue-next';

export default defineComponent({
    props: {
        users: {
            type: Array as PropType<Required<{ id: string, name: string }[]>>,
            required: true,
        },
        maxCount: {
            type: Number as PropType<Required<number>>,
            required: true,
        },
        size: {
            type: String,
        }
    },
    setup(props, { slots }) {
        return () => (
            <AvatarGroup class="userList">
                {
                    props.users?.slice(0, props.maxCount)?.map(user => (
                        <Tooltip key={user.id}>
                            {{
                                title: () => (
                                    <div>
                                        <div>{user.name || '-'}</div>
                                        {slots.userExtra?.({ user, dark: true })}
                                    </div>
                                ),
                                default: () => (
                                    <UserAvatar username={user.name} size={props.size} showText={false}></UserAvatar>
                                )
                            }}
                            
                        </Tooltip>
                    ))
                }

                {
                    (props.users?.length > props.maxCount) ? (
                        <Dropdown title={`+${props.users.length - props.maxCount}`} key="more">
                            {{
                                overlay: () => (
                                    <div class="overlay">
                                        {
                                            props.users.slice(props.maxCount).map(user => (
                                                <div class="flex items-center mb-2 [&:last-child]:mb-0">
                                                    <UserAvatar username={user.name} showText={false}></UserAvatar>
                                                    <div class="ml-2">
                                                        <div>{user.name}</div>
                                                        {slots.userExtra?.({ user })}
                                                    </div>
                                                    
                                                </div>
                                                
                                            ))
                                        }
                                    </div>
                                ),
                                default: () => (
                                    <div class="more">
                                        <Ellipsis size={14}></Ellipsis>
                                    </div>
                                ),
                            }}
                            
                        </Dropdown>
                    ) : ''
                }   
            </AvatarGroup>
        );
    }
});
</script>

<style scoped>
.userList :deep(>*:not(:first-child)) {
    margin-inline-start: -4px;
}

.userList :deep(.zsui-user) {
    height: 28px!important;
    cursor: default;
    mask: url("data:image/svg+xml,%0A%20%20%3Csvg%20width%3D%2224px%22%20height%3D%2224px%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22%0A%20%20%20%20%20%20M%2020.7%2C%203.735013611626453%0A%20%20%20%20%20%20A%2012%2C%2012%2C%200%2C%201%2C%200%2C%2020.7%2C%2020.264986388373547%0A%20%20%20%20%20%20M%2020.7%2C%203.735013611626453%0A%20%20%20%20%20%20A%2014%2C%2014%2C%200%2C%200%2C%200%2C%2020.7%2C%2020.264986388373547%0A%20%20%20%20%22%20fill%3D%22%23000%22%20stroke-width%3D%220%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%3C%2Fsvg%3E%0A%20%20") 0px 0px / 100% 100% no-repeat!important;
}

.userList :deep(.zsui-user:last-child) {
    mask: none!important;
}

.more {
    color: #646a73;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background: #eff0f1;   
}

.overlay {
    width: 240px;
    padding: 8px 12px 8px;
    border: 1px solid #dee0e3;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px 8px #1f23290a,0 6px 12px #1f23290a,0 4px 8px -8px #1f23290f;
    overflow-y: auto;
}
</style>