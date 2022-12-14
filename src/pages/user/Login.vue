<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Email is required']"
          type="email"
        />

        <q-input
          label="Password"
          :type="viewPass ? 'text' : 'password'"
          v-model="form.password"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Password is required']"
          bottom-slot
        >
          <template v-slot:append>
            <q-btn
              @click="showPass"
              round
              dense
              flat
              color="primary"
              :icon="viewPass ? 'visibility' : 'visibility_off'"
            />
          </template>
        </q-input>

        <div class="full-width q-pt-md">
          <q-btn label="Login" color="primary" class="full-width" outline rounded type="submit" />
        </div>
        <div class="full-width q-gutter-y-sm">
          <q-btn label="Register" color="primary" class="full-width" flat to="/register" size="sm" />
          <q-btn
            label="Forgot Password ?"
            color="primary"
            class="full-width"
            flat
            :to="{ name: 'forgot-password' }"
            size="sm"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import useAuthUser from 'src/composables/UseAuthUser';
import useNotify from 'src/composables/UseNotify';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageLogin',

  setup() {
    const router = useRouter();

    const { login, isLoggedIn } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      email: '',
      password: '',
    });

    const viewPass = ref(false);

    const showPass = () => {
      viewPass.value = !viewPass.value;
    };

    onMounted(() => {
      if (isLoggedIn()) {
        router.push({ name: 'me' });
      }
    });

    const handleLogin = async () => {
      try {
        await login(form.value);
        notifySuccess('Login successfully!');
        router.push({ name: 'me' });
      } catch (error) {
        notifyError('Failed login, try again!');
      }
    };

    return {
      form,
      viewPass,
      handleLogin,
      showPass,
    };
  },
});
</script>
