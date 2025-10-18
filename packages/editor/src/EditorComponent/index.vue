<script lang="tsx">
import { defineComponent, onMounted, PropType, ref } from 'vue';

import { UserType } from '../Editor/interface';
import { userStore } from '../Editor/store/user';
import Editor from './editor.vue';

export default defineComponent({
  props: {
    doc: Object,
    docMetaComponent: {
      type: Object,
    },
    collectionComponent: {
      type: Object,
    },
    titleFormatter: {
      type: Function,
    },
    user: Object as PropType<UserType>
  },
  setup(props, { slots }) {
    const userNotFound = ref(false);

    onMounted(() => {
      if (props.user) {
        userStore.getState().setUser(props.user);
      } else {
        userNotFound.value = true;
      }
    });

    return () => userNotFound.value ? (
      <div>user not found</div>
    ) : (
      <Editor 
        doc={props.doc} 
        user={props.user}
        docMetaComponent={props.docMetaComponent} 
        collectionComponent={props.collectionComponent}
        titleFormatter={props.titleFormatter}
      >
        {slots}
      </Editor>
    );
  }
});
</script>