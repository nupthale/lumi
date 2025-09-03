import { html, render } from 'lit-html';
import { message } from 'ant-design-vue';
import { i18next } from '@editor/i18n';

import { EventEmit } from '../../../../../shared/event';

import './index.less';

export type IframeProps = {
    src: string;
}

export class Iframe extends EventEmit {
    private props: IframeProps | null = null;

    private loading = false;

    private error = false;

    constructor(private mountNode: HTMLElement | null) {
        super();
    }

    get input() {
        return this.mountNode?.querySelector('.doc-component-iframeInput') as HTMLInputElement;
    }

    handleClickContainer = () => {
        this.input?.focus();
    }

    submit = (e) => {
        this.stop(e);

        const url = this.input?.value || '';

        if (!url) {
            this.error = true;

            message.error(i18next.t('editor.iframe.placeholder'));

            this.render(this.props);
            return;
        };

        this.error = false;
        this.loading = true;

        this.render(this.props);

        this.emit('change', {
            src: url,
        });
    }

    onLoad = () => {
        this.loading = false;
        this.render(this.props);
    }

    template() {
        const props = this.props;

        if (!props) {
            return html``;
        }

        if (!props.src) {
            return html`
                <div class="doc-component-iframeEmpty flex items-centeroverflow-hidden ${this.error ? 'error' : ''}" @click=${this.handleClickContainer}>
                    <div class="w-full flex items-center justify-between">
                        <div class="mr-3 flex items-center flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link2-icon lucide-link-2"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        
                            <input 
                                class="flex-1 ml-3 doc-component-iframeInput" 
                                placeholder="${i18next.t('editor.iframe.placeholder')}" 
                                @keydown=${this.stop}
                                @copy=${this.stop}
                                @paste=${this.stop}
                            />
                        </div>
                        <div>
                            <button class="doc-component-iframeSubmit" @click=${this.submit}>${i18next.t('editor.iframe.okButton')}</button>
                        </div>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="doc-component-iframe relative w-full h-[461px]">
                ${
                    this.loading ? (
                        html`
                            <div class="doc-component-iframeLoading flex items-center justify-center absolute top-0 right-0 left-0 bottom-0">
                                <div class="animate-spin origin-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0"/><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6"/><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6"/><circle cx="12" cy="12" r="10"/></svg>
                                </div>
                            </div>
                        `) : ''
                }
                <iframe src="${props.src}" width="100%" height="100%"  @load=${this.onLoad} @error=${this.onLoad}  />
            </div>
        `;
    }

    stop = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }

    render(props) {
        if (!this.mountNode) return;

        this.props = props;
        render(this.template(), this.mountNode);
    }

    destory = () => {
        super.destroy();

        if (!this.mountNode) {
           return;
        }

        // 清空渲染内容
        render(null, this.mountNode);

        this.mountNode = null;
    }
}