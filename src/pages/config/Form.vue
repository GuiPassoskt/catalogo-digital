<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Config</p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Store Name"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || 'Name is required']"
        />

        <q-input label="Phone" v-model="form.phone" mask="(##) #####-####" unmasked-value />

        <q-input label="Image Paralax" stack-label v-model="paralax" type="file" accept="image/*" />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color v-model="form.primary" class="col-md-4 col-sm-12 col-xs-12" />

          <q-color v-model="form.secondary" class="col-md-4 col-sm-12 col-xs-12" />
        </div>

        <q-btn label="Save" color="primary" class="full-width" rounded type="submit" />

        <q-btn label="Cancel" color="primary" class="full-width" rounded flat :to="{ name: 'category' }" />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useApi from 'src/composables/UseApi';
import useNotify from 'src/composables/UseNotify';
import useBrand from 'src/composables/UseBrand';
import userAuthUser from 'src/composables/UseAuthUser';

import { Generic, Form } from 'src/interfaces';

export default defineComponent({
  name: 'PageFormConfig',
  setup() {
    const table = 'config';
    const router = useRouter();
    const { post, listPublic, update, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const { setBrand } = useBrand();
    const { session } = userAuthUser();

    const config = ref<Form[]>([
      {
        id: '',
        name: '',
        phone: '',
        primary: '',
        secondary: '',
        paralax_url: '',
      },
    ]);
    const paralax = ref([]);
    const form = ref<Generic<Form>>({
      id: '',
      name: '',
      phone: '',
      primary: '',
      secondary: '',
      paralax_url: '',
    });

    onMounted(() => {
      handleGetConfig();
    });

    const handleSubmit = async () => {
      try {
        if (paralax.value.length > 0) {
          const paralaxUrl = await uploadImg(paralax.value[0], 'paralax');
          form.value.paralax_url = paralaxUrl;
        }
        if (form.value.id) {
          await update(table, form.value.id, form.value);
          notifySuccess('Update Successfully');
        } else {
          const payload = {
            name: form.value.name,
            phone: form.value.phone,
            primary: form.value.primary,
            secondary: form.value.secondary,
            paralax_url: form.value.paralax_url,
          };
          await post(table, payload);
          notifySuccess('Saved Successfully');
        }
        setBrand(form.value.primary, form.value.secondary);
        router.push({ name: 'me' });
      } catch (error) {
        const message = form.value.id ? 'Failed update' : 'Failed save';
        notifyError(message);
      }
    };

    const handleGetConfig = async () => {
      try {
        config.value = await listPublic<Form>(table, String(session.value?.user?.id), '', '');
        if (config.value.length > 0) {
          form.value = config.value[0];
        }
      } catch (error) {
        notifyError('Failed list');
      }
    };

    return {
      handleSubmit,
      form,
      paralax,
    };
  },
});
</script>
