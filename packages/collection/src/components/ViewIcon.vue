<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { Layers, ClipboardList, Images } from 'lucide-vue-next';

import { ViewEnum } from '@collection/interface';

const iconMap = {
    [ViewEnum.GRID]: {
        component: Layers,
        color: '#00BFFF',
    },
    [ViewEnum.BOARD]: {
        component: ClipboardList,
        color: '#FF6211'
    },
    [ViewEnum.GALLERY]: {
        component: Images,
        color: '#02D66E',
    },
};

export default defineComponent({
    props: {
        type: {
            type: String as PropType<ViewEnum>,
        },
        size: {
            type: Number,
            default: 14,
        },
    },
    setup(props) {
        const IconComponent = iconMap[props.type || ViewEnum.GRID];

        return () => (
            <IconComponent.component width={props.size} height={props.size} color={IconComponent.color} />
        );
    }
});   
</script>