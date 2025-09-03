import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart';
import domAlign from 'dom-align';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventEmit } from '../../../../../shared/event';
import { docScroll$ } from '@editor/Editor/event';

import './index.less';

const emojiPortalId = 'emoji-portal';

export class Emoji extends EventEmit {
    private picker: Picker | null = null;

    private visible: boolean = false;

    private portal: HTMLElement | null = null;

    private subscription: Subscription | null = null;

    constructor(private btnNode: HTMLElement | null, private mountNode: HTMLElement | null) {
        super();

        this.initEvt();
    }

    stopEvt = (e) => {
        e.stopPropagation();
    }

    updatePicker = () => {
        if (this.visible) {
            this.picker = new Picker({ 
                data,
                onEmojiSelect: (e) => {
                    this.emit('emojiSelect', e.native);

                    this.destroyPicker();
                },
              });

              this.portal = document.getElementById(emojiPortalId);

              if (!this.portal) {
                this.portal = document.createElement('div');
                this.portal.setAttribute('id', emojiPortalId);
                document.body.appendChild(this.portal);
                this.portal.addEventListener('keydown', this.stopEvt);
                this.portal.addEventListener('click', this.stopEvt);
              }

              this.portal.style.position = 'fixed';

              this.portal.appendChild(this.picker as any);
              this.layout();
        } else {
            // 卸载picker
            this.destroyPicker();
        }
    }

    layout = () => {
        if (!this.picker || !this.mountNode) {
            return;
        }
        domAlign(
            this.picker,
            this.mountNode as HTMLElement,
            {
                points: ['tl', 'tr'],
                offset: [0, 0],
                overflow: { adjustX: false, adjustY: false },
                useCssTransform: true,
            }
        )
    }

    destroyPicker = () => {
        this.visible = false;

        if (this.portal) {
            this.portal.innerHTML = '';
        }
       
        this.picker = null;
    }

    handleMountNodeClick = (e) => {
        e.stopPropagation();

        this.visible = true;
        this.updatePicker();
    }

    initEvt = () => {
        document.addEventListener('click', this.destroyPicker);
        this.btnNode?.addEventListener('click', this.handleMountNodeClick);

        this.subscription = docScroll$.pipe(
            tap(() => {
                this.layout();
            }),
        ).subscribe()
    }

    destory = () => {
        super.destroy();

        document.removeEventListener('click', this.destroyPicker);
        this.btnNode?.removeEventListener('click', this.handleMountNodeClick);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (!this.mountNode) {
           return;
        }

        this.destroyPicker();

        this.mountNode = null;
        this.btnNode = null;
    }
}