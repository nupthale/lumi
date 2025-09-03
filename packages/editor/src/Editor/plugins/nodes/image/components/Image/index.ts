import { html, render } from 'lit-html';
import { createApp, App } from 'vue';
import { ImagePreview } from '@zsfe/zsui';
import { message } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import { EventEmit } from '../../../../../shared/event';
import { download } from '../../../../../shared/file';

import { upload_preset, cloud_name } from '~/uploadToken';

import './index.less';

export type ImageProps = {
    src: string;
}

export class Image extends EventEmit {
    private props: ImageProps | null = null;

    private previewApp: App<Element> | null = null;

    private loading = false;

    constructor(private mountNode: HTMLElement | null) {
        super();
    }

    // 根据props.src 下载图片
    download = () => {
        if (!this.props?.src) {
            return;
        }

        download(this.props?.src, i18next.t('editor.image.downloadFileName'));
    }
    
    preview = () => {
        if (this.previewApp) {
            this.previewApp?.unmount();
            this.previewApp = null;
        }

        const previewContainer = document.createElement('div');
        document.body.appendChild(previewContainer);

        this.previewApp = createApp(ImagePreview, {
            src: this.props?.src,
            onClose: () => {
                this.previewApp?.unmount();
                this.previewApp = null;

                // 移除容器元素
                previewContainer.remove();
            }
        });

        this.previewApp.mount(previewContainer);
    }

    updateLoading = (loading) => {
        this.loading = loading;
        this.render(this.props);
    }

    uploadLocal = async (e) => {
        if (!window.clientAPI) {
            return;
        }

        if (this.loading) {
            message.info(i18next.t('editor.image.uploading'));
            return;
        }

        const file = e.target.files[0];

        if (!file) return;

        this.updateLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result;

            if (!arrayBuffer) {
                return;
            }

            const result = await window.clientAPI.upload({
              file: { 
                type: file.type,
                data: Array.from(new Uint8Array(arrayBuffer)) 
              },
              name: file.name
            });

            if (result.code !== 200) {
                message.error(i18next.t('editor.image.uploadFailed'));
                return;
            }

            //  提前加载缓存图片
            const img = document.createElement('img');
            const src = result.data.src;
            img.src = src;

            img.onload = () => {
                this.updateLoading(false);

                this.emit('change', {
                    src,
                    width: img.width,
                });
            }
        };
        reader.readAsArrayBuffer(file);
    }

    upload = async (e) => {
        if (window.isElectron) {
            return this.uploadLocal(e);
        }

        if (this.loading) {
            message.info(i18next.t('editor.image.uploading'));
            return;
        }

        const file = e.target.files[0];

        if (!file) return;

        this.updateLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', upload_preset); // 从 Cloudinary 控制台获取
        formData.append('cloud_name', cloud_name);       // 从 Cloudinary 控制台获取

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dybz0bvui/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (data.secure_url) {
             //  提前加载缓存图片
            const img = document.createElement('img');
            img.src = data.secure_url;

            img.onload = () => {
                this.updateLoading(false);

                this.emit('change', {
                    src: data.secure_url,
                    width: img.width,
                });
            }
        } else {
            message.error(i18next.t('editor.image.uploadFailed'));

            this.updateLoading(false);
        }
    }

    template() {
        const props = this.props;

        if (!props) {
            return html``;
        }

        if (!props.src) {
            return html`
                <div class="doc-component-imageEmpty flex items-center justify-between overflow-hidden">
                    <div class="flex items-center">
                        <div class="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-up-icon lucide-image-up"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>
                        </div>
                        <div>${i18next.t('editor.image.placeholder')}</div>
                    </div>
                    ${
                        this.loading ? html`
                            <div class="doc-component-imageLoading flex items-center">
                                <div class="animate-spin origin-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0"/><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6"/><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6"/><circle cx="12" cy="12" r="10"/></svg>
                                </div>
                                <span class="text-xs ml-1">${i18next.t('editor.image.uploading')}</span>
                            </div>
                        ` : ''
                    }
                    <input type="file" class="absolute w-[800px] h-[800px] !cursor-pointer" accept="image/*" @change=${this.upload} />
                </div>
            `;
        }

        return html`
            <div class="doc-component-image w-full h-full">
                <img src="${props.src}" width="100%" height="100%" />

                <div class="doc-component-imageToolbar absolute">
                    <div class="doc-component-imageToolbarItem" aria-label="${i18next.t('editor.image.download')}" data-microtip-position="top" role="tooltip" @click=${this.download}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </div>
                    <div class="doc-component-imageToolbarItem" aria-label="${i18next.t('editor.image.preview')}" data-microtip-position="top" role="tooltip" @click=${this.preview}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div class="doc-component-imageToolbarItem overflow-hidden" aria-label="${i18next.t('editor.image.reupload')}" data-microtip-position="top" role="tooltip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-up-icon lucide-image-up"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>
                        <input type="file" class="absolute w-[800px] h-[800px] !cursor-pointer" accept="image/*" @change=${this.upload} />
                    </div>
                </div>
            </div>
        `;
    }

    render(props) {
        if (!this.mountNode) return;

        this.props = props;
        render(this.template(), this.mountNode);
    }

    destory = () => {
        super.destroy();

        // 确保预览组件被完全销毁
        if (this.previewApp) {
            this.previewApp.unmount();
            this.previewApp = null;
        }

        if (!this.mountNode) {
           return;
        }
       
        // 清空渲染内容
        render(null, this.mountNode);

        this.mountNode = null;
    }
}