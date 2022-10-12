<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Category</p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input label="Name *" v-model="form.name" :rules="[val => (val && val.length > 0) || 'Name is required']" />

        <q-input label="Description" v-model="form.description" class="q-mb-md" />

        <q-btn :label="isUpdate ? 'Update' : 'Save'" color="primary" class="full-width" rounded type="submit" />

        <q-btn label="Cancel" color="primary" class="full-width" rounded flat :to="{ name: 'category' }" />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useApi from 'src/composables/UseApi';
import useNotify from 'src/composables/UseNotify';
import { Category, CategoryRequest } from 'src/interfaces';

export default defineComponent({
  name: 'PageFormCategory',
  setup() {
    const table = 'category';
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const isUpdate = computed(() => route.params.id);

    const form = ref<Category>({
      id: '',
      name: '',
      description: '',
    });

    onMounted(() => {
      if (isUpdate.value) {
        handleGetCategory(String(isUpdate.value));
      }
    });

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update<Category>(table, form.value.id, form.value);
          notifySuccess('Update Successfully');
        } else {
          const payload = {
            name: form.value.name,
            description: form.value.description,
          };
          await post<CategoryRequest>(table, payload);
          notifySuccess('Saved Successfully');
        }
        router.push({ name: 'category' });
      } catch (error) {
        const message = isUpdate.value ? 'Failed update' : 'Failed save';
        notifyError(message);
      }
    };

    const handleGetCategory = async (id: string) => {
      try {
        const category = await getById<Category>(table, id);
        if (category) {
          form.value = category;
        }
      } catch (error) {
        notifyError('Failed get category');
      }
    };

    return {
      handleSubmit,
      form,
      isUpdate,
    };
  },
});
</script>
