<script lang="tsx">
import { defineComponent, computed, watchEffect } from 'vue';
import { Menu, Dropdown } from 'ant-design-vue';
import { useLocalStorage, usePreferredColorScheme } from '@vueuse/core';
import { ChevronDown, Check } from 'lucide-vue-next';
import { TextButton } from '@zsfe/zsui';
import i18next from 'i18next';

import { switchTheme } from '@/shared/theme';
import SelectDropdown from '@/components/SelectDropdown/index.vue';

import { AppearanceEnum, OptionType } from '../interface';

const MenuItem = Menu.Item;

export default defineComponent({
  setup() {
    const appearanceOptions: OptionType[] = [{
        label: i18next.t('setting.useSystemTheme'),
        value: AppearanceEnum.SYSTEM,
    }, {
        label: i18next.t('setting.themeLight'),
        value: AppearanceEnum.LIGHT,
    }, {
        label: i18next.t('setting.themeDark'),
        value: AppearanceEnum.DARK,
    }];

    const preferredColor = usePreferredColorScheme();

    const appearanceRef = useLocalStorage('appearance', AppearanceEnum.LIGHT);

    const appearanceText = computed(() => {
        return appearanceOptions.find(option => option.value === appearanceRef.value)?.label || '';
    });

    const handleSelect = (option: OptionType) => {
        // 记录localstorage
        appearanceRef.value = option.value;

        // 切换主题
        if (option.value === AppearanceEnum.SYSTEM) {
            switchTheme(preferredColor || AppearanceEnum.LIGHT);
        } else {
            switchTheme(option.value);
        }
        
    }

    return () => (
        <div class="settingItem">
            <div class="settingItem__left">
            <div class="settingItem__title">
                {i18next.t('setting.appearance')}
            </div>
            <div class="lightText text-xs mt-1.5">
                {i18next.t('setting.appearanceDesc')}
            </div>
            </div>
            <div class="settingItem__right">
                <SelectDropdown options={appearanceOptions} onSelect={handleSelect}>
                    {{
                        item: ({ option }: { option: OptionType }) => (
                            <div class="optionItem flex items-center justify-between">
                                <div class="flex-1">{option.label}</div>
                                {
                                    option.value === appearanceRef.value? (
                                        <div><Check width="8x" /></div>
                                    ) : ''
                                }
                            </div>
                        ),
                        default: () => (
                            <TextButton>
                                <div class="flex items-center">
                                    <span class="mr-1">{appearanceText.value}</span>
                                    <ChevronDown width="12px" /> 
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