<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Product</p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input label="Image" stack-label v-model="img" type="file" accept="image/*" />

        <q-input label="Name" v-model="form.name" :rules="[val => (val && val.length > 0) || 'Name is required']" />

        <q-editor v-model="form.description" min-height="5rem" />

        <q-input label="Amount" v-model="form.amount" :rules="[val => !!val || 'Amount is required']" type="number" />

        <q-input label="Price" v-model="form.price" :rules="[val => !!val || 'Price is required']" prefix="R$" />

        <q-select
          v-model="form.category_id"
          :options="optionsCategory"
          label="Category"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[val => !!val || 'Category is required']"
        />

        <q-btn :label="isUpdate ? 'Update' : 'Save'" color="primary" class="full-width" rounded type="submit" />

        <q-btn label="Cancel" color="primary" class="full-width" rounded flat :to="{ name: 'product' }" />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useApi from 'src/composables/UseApi';
import useNotify from 'src/composables/UseNotify';
import useAuthUser from 'src/composables/UseAuthUser';
import { Generic, Product, ProductRequest, Category } from 'src/interfaces';

export default defineComponent({
  name: 'PageFormCategory',
  setup() {
    const table = 'product';
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update, listPublic, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const { session } = useAuthUser();

    const isUpdate = computed(() => route.params.id);

    const optionsCategory = ref<Category[]>([]);
    const form = ref<Generic<Product>>({
      id: '',
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: '',
      img_url: '',
    });
    const img = ref([]);

    onMounted(() => {
      handleListCategories();
      if (isUpdate.value) {
        handleGetProduct(String(isUpdate.value));
      }
    });

    const handleListCategories = async () => {
      optionsCategory.value = await listPublic<Category>('category', String(session.value?.user?.id), '', '');
    };

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], 'products');
          form.value.img_url = imgUrl;
        }
        if (isUpdate.value) {
          await update<Product>(table, form.value.id, form.value);
          notifySuccess('Update Successfully');
        } else {
          const payload = {
            name: form.value.name,
            description: form.value.description,
            amount: form.value.amount,
            price: form.value.price,
            category_id: form.value.category_id,
            img_url: form.value.img_url,
          };
          await post<ProductRequest>(table, payload);
          notifySuccess('Saved Successfully');
        }
        router.push({ name: 'product' });
      } catch (error) {
        notifyError(isUpdate.value ? 'Failed update' : 'Failed save');
      }
    };

    const handleGetProduct = async (id: string) => {
      try {
        const product = await getById<Product>(table, id);
        if (product) {
          form.value = product;
        }
      } catch (error) {
        notifyError('Falied get product, try again!');
      }
    };

    return {
      handleSubmit,
      form,
      isUpdate,
      optionsCategory,
      img,
    };
  },
});
</script>
