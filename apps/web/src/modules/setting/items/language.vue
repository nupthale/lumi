<script lang="tsx">
import { defineComponent, computed, watchEffect } from 'vue';
import { Menu } from 'ant-design-vue';
import { useLocalStorage, usePreferredLanguages } from '@vueuse/core';
import { ChevronDown, Check } from 'lucide-vue-next';
import { TextButton } from '@zsfe/zsui';
import i18next from 'i18next';

import { switchTheme } from '@/shared/theme';
import SelectDropdown from '@/components/SelectDropdown/index.vue';
import { optionProps } from 'ant-design-vue/es/vc-mentions/src/Option';

const MenuItem = Menu.Item;

export type OptionType = {
    label: string;
    value: string;
};

const languageOptions: OptionType[] = [{
    label: '简体中文',
    value: 'zh-CN',
}, {
    label: 'English',
    value: 'en-US',
}, {
    label: '日本語',
    value: 'ja',
}];

export default defineComponent({
  setup() {
    const languages = usePreferredLanguages();

    const preferedLanguage = computed(() => {
        const supportedLanguages = languageOptions.map(option => option.value);
        const preferedLanguage = languages.value?.[0];

        if (supportedLanguages.includes(preferedLanguage)) {
            return preferedLanguage;
        }

        return 'zh-CN';
    });

    const languageRef = useLocalStorage('language', preferedLanguage.value);

    const switchLanguage = (language: string) => {
        i18next.changeLanguage(language);

        // 刷新页面
        if (window.isElectron && window.clientAPI) {
            window.clientAPI.send('reload-window');
        } else {
            location.href = location.href;
        }
    }

    const languageText = computed(() => {
        return languageOptions.find(option => option.value === languageRef.value)?.label || '';
    });

    const handleSelect = (option: OptionType) => {
        // 记录localstorage
        languageRef.value = option.value;

        switchLanguage(option.value);
        
    }

    return () => (
        <div class="settingItem">
            <div class="settingItem__left">
            <div class="settingItem__title">
                {i18next.t('setting.language')}
            </div>
            <div class="lightText text-xs mt-1.5">
                {i18next.t('setting.languageDesc')}
            </div>
            </div>
            <div class="settingItem__right">
                <SelectDropdown options={languageOptions} onSelect={handleSelect}>
                    {{
                        item: ({ option }: { option: OptionType }) => (
                            <div class="optionItem flex items-center justify-between">
                                <div class="flex-1">{option.label}</div>
                                {
                                    option.value === languageRef.value? (
                                        <div><Check width="8x" /></div>
                                    ) : ''
                                }
                            </div>
                        ),
                        default: () => (
                            <TextButton>
                                <div class="flex items-center">
                                    <span class="mr-1">{languageText.value}</span>
                                    <ChevronDown width="12x" /> 
                                </div>
                            </TextButton>
                        )
                    }}
                </SelectDropdown>
                
            </div>
        </div>
    );
  }
});
</script>

<style src="../index.css"></style>

<style scoped>
.optionItem {
    width: 180px;
}
</style>