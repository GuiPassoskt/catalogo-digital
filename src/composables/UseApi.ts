import useSupabase from 'src/boot/supabase';
import useAuthUser from './UseAuthUser';
import { uuidv4 } from 'src/utils/uuid';
import { useRoute } from 'vue-router';
import useBrand from 'src/composables/UseBrand';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import { Brand, Generic } from 'src/interfaces';

const brand = ref<Brand>({
  primary: '',
  secondary: '',
  name: '',
  phone: '',
  paralax_url: '',
});

export default function useApi() {
  const { supabase } = useSupabase();
  const { session } = useAuthUser();
  const route = useRoute();
  const { setBrand } = useBrand();
  const $q = useQuasar();

  const list = async (table: string) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  };

  const listPublic = async <T>(table: string, userId: string, columnFilter: string, filter: string) => {
    const { data, error } = await supabase.from(table).select('*').eq('user_id', userId).eq(columnFilter, filter);
    if (error) throw error;
    return <T[]>data;
  };

  const fetchCount = async (table: string, userId: string) => {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' }).eq('user_id', userId);
    if (error) throw error;
    return {
      data,
      count,
    };
  };

  const getById = async <T>(table: string, id: string) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id);
    if (error) throw error;
    return data ? <T>data[0] : null;
  };

  const post = async <T>(table: string, form: Generic<T>) => {
    const { data, error } = await supabase.from(table).insert([
      {
        ...form,
        user_id: session?.value?.user?.id,
      },
    ]);
    if (error) throw error;
    return data;
  };

  const update = async <T>(table: string, id: string, form: Generic<T>) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: id });
    if (error) throw error;
    return data;
  };

  const remove = async (table: string, id: string) => {
    const { data, error } = await supabase.from(table).delete().match({ id });
    if (error) throw error;
    return data;
  };

  const uploadImg = async (file: File, storage: string) => {
    const fileName = uuidv4();
    return await supabase.storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })
      .then(() => {
        const publicUrl = getUrlPublic(fileName, storage);
        return publicUrl?.toString();
      })
      .catch(error => {
        if (error) throw error;
      });
  };

  const getUrlPublic = (fileName: string, storage: string) => {
    const { publicURL, error } = supabase.storage.from(storage).getPublicUrl(fileName);
    if (error) throw error;
    return publicURL;
  };

  const getBrand = async () => {
    const id = route.params.id || session?.value?.user?.id;
    if (id) {
      $q.loading.show({
        backgroundColor: 'dark',
      });
      const { data, error } = await supabase.from('config').select('*').eq('user_id', id);
      if (error) throw error;
      if (data && data?.length > 0) {
        brand.value = data[0];
        setBrand(brand.value.primary, brand.value.secondary);
      }
      $q.loading.hide();
      return brand;
    } else {
      return null;
    }
  };

  return {
    list,
    listPublic,
    fetchCount,
    getById,
    post,
    update,
    remove,
    uploadImg,
    getBrand,
    brand,
  };
}
