<script lang="tsx">
import { ref, onMounted, PropType, defineComponent, watchEffect } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

export default defineComponent({
    props: {
        icon: {
            type: String as PropType<keyof typeof LucideIcons>,
            required: true,
        },
        width: {
            type: Number,
            default: 16,
        },
        color: String,
    },
    setup(props) {
        const IconComponent = LucideIcons[props.icon];

        return () => (
            <IconComponent 
                size={props.width} 
                color={props.color}
            />
        );
    }
});
</script>