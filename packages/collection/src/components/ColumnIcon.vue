<script lang="tsx">
import { defineComponent, PropType, computed } from 'vue';
import { LetterText, DecimalsArrowRight, CalendarDays, CircleArrowDown, CircleDollarSign, Image } from 'lucide-vue-next';

import { themeTokens } from '@collection/shared/theme';
import { ColumnTypeEnum } from '@collection/interface';

const iconMap = {
    [ColumnTypeEnum.TEXT]: LetterText,
    [ColumnTypeEnum.NUMBER]: DecimalsArrowRight,
    [ColumnTypeEnum.DATE]: CalendarDays,
    [ColumnTypeEnum.SELECT]: CircleArrowDown,
    [ColumnTypeEnum.CURRENCY]: CircleDollarSign,
    [ColumnTypeEnum.IMAGE]: Image,
};

export default defineComponent({
    props: {
        type: {
            type: String as PropType<ColumnTypeEnum>,
            required: true,
        },
        size: {
            type: Number,
            default: 14,
        },
    },
    setup(props) {

        const IconComponent = computed(() => {
            return iconMap[props.type]
        })

        return () => (
            <IconComponent.value width={props.size} height={props.size} color={themeTokens.textColor()} />
        );
    }
});   
</script>