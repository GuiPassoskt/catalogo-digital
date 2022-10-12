<template>
  <q-card class="my-card" bordered v-ripple:primary>
    <q-skeleton height="50px" v-if="load" />
    <q-card-section horizontal v-else>
      <div class="col flex flex-center text-h5">{{ count }} - {{ label }}</div>

      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="primary" :icon="icon" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import useApi from 'src/composables/UseApi';
import useAuthUser from 'src/composables/UseAuthUser';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'CardDashboard',
  props: {
    table: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi-database-outline',
    },
  },
  setup(props) {
    const count = ref(0);
    const load = ref(true);
    const { session } = useAuthUser();
    const { fetchCount } = useApi();

    const user = ref(session.value?.user);

    onMounted(async () => {
      if (user.value?.id != '') {
        const response = await fetchCount(props.table, String(user.value?.id));
        count.value = response.count || 0;
        load.value = false;
      }
    });
    return {
      count,
      load,
    };
  },
});
</script>
