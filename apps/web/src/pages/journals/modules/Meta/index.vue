<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { UserAvatar } from '@zsfe/zsui';
import i18next from 'i18next';
import { Tag } from '@zsfe/zsui';

import { formatTime } from '@/shared/date';
import ExportFile from '@/pages/doc/modules/actions/ExportFile.vue';

const hellos = [
  i18next.t('greetings.greeting1'),
  i18next.t('greetings.greeting2'),
  i18next.t('greetings.greeting3'),
  i18next.t('greetings.greeting4'),
  i18next.t('greetings.greeting5'),
  i18next.t('greetings.greeting6'),
  i18next.t('greetings.greeting7'),
  i18next.t('greetings.greeting8'),
  i18next.t('greetings.greeting9'),
  i18next.t('greetings.greeting10'),
  i18next.t('greetings.greeting11'),
  i18next.t('greetings.greeting12'),
  i18next.t('greetings.greeting13'),
  i18next.t('greetings.greeting14'),
  i18next.t('greetings.greeting15'),
  i18next.t('greetings.greeting16'),
  i18next.t('greetings.greeting17'),
  i18next.t('greetings.greeting18'),
  i18next.t('greetings.greeting19'),
  i18next.t('greetings.greeting20'),
];

const emojis = [
    '😊',
    '😄',
    '🌟',
    '☀️',
    '💪',
    '🌸',
    '💖',
    '🤗',
    '✨',
    '🎉',
    '🔥',
    '🌞',
    '🌙',
    '❤️',
    '💎',
    '🌊',
    '🌈',
];

export default defineComponent({
    props: {
        doc: {
            type: Object,
            default: () => ({})
        },
        user: Object,
    },
    setup(props) {
        const helloRef = ref(hellos[Math.floor(Math.random() * hellos.length)]);
        const emojiRef = ref(emojis[Math.floor(Math.random() * emojis.length)]);

        return () => (
            <div class="w-full flex items-center justify-between lightText">
                <div class="flex items-center">
                    <UserAvatar showText={false} username="m" size="small" class="mr-2" />
                    {formatTime(props.doc?.contentUpdatedAt)} 修改
                    <div class="divider"></div>
                    <Tag color="orange">
                        <div class="flex items-center">
                            <span class="text-lg mr-1">{emojiRef.value}</span>
                            {helloRef.value}
                        </div>
                    </Tag>
                </div>
                <div>
                    <ExportFile fileId={props.doc.fileId} />
                </div>
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