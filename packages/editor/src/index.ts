import './index.css';

export * from './Editor/interface';

import Editor from './EditorComponent/index.vue';

import { schema } from './Editor/plugins/schema/index';

export {
    Editor,
    schema,
};