import { ref } from 'vue';

import useSupabase from 'boot/supabase';

import { Login, Register } from 'src/interfaces';
import { User, Session, Provider } from '@supabase/supabase-js/dist/main';

// user is set outside of the useAuthUser function
// so that it will act as global state and always refer to a single user

// o usuário é definido fora da função useAuthUser para que atue como um estado global
// e sempre se refira a um único usuário
const session = ref<Session | null>({
  access_token: '',
  token_type: '',
  expires_at: 0,
  expires_in: 0,
  provider_refresh_token: '',
  provider_token: '',
  refresh_token: '',
  user: {
    id: '',
    app_metadata: {
      provider: '',
    },
    aud: '',
    created_at: '',
    user_metadata: {},
    action_link: '',
    confirmation_sent_at: '',
    confirmed_at: '',
    email: '',
    email_change_sent_at: '',
    email_confirmed_at: '',
    identities: [],
    invited_at: '',
    last_sign_in_at: '',
    new_email: '',
    phone: '',
    phone_confirmed_at: '',
    recovery_sent_at: '',
    role: '',
    updated_at: '',
  },
});

export default function useAuthUser() {
  const { supabase } = useSupabase();
  /**
   * Login with email and password
   */
  const login = async (userlogin: Login) => {
    const { user, error } = await supabase.auth.signIn(userlogin);
    if (error) throw error;
    return user;
  };

  /**
   * Login with google, github, etc
   */
  const loginWithSocialProvider = async (provider: Provider) => {
    const { user, error } = await supabase.auth.signIn({ provider });
    if (error) throw error;
    return user;
  };

  /**
   * Logout
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = () => {
    return !!session.value?.user?.id;
  };

  /**
   * Register
   */
  const register = async (userRegister: Register) => {
    const { user, error } = await supabase.auth.signUp(userRegister, {
      // arbitrary meta data is passed as the second argument under a data key
      // to the Supabase signUp method
      data: userRegister.meta,
      // the to redirect to after the user confirms their email
      // window.location wouldn't be available if we were rendering server side
      // but since we're all on the client it will work fine
      redirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation"`,
    });
    if (error) throw error;
    return user;
  };

  /**
   * Update user email, password, or meta data
   */
  const update = async (data: User) => {
    const { user, error } = await supabase.auth.update(data);
    if (error) throw error;
    return user;
  };

  /**
   * Send user an email to reset their password
   * (ie. support "Forgot Password?")
   */
  const sendPasswordRestEmail = async (email: string) => {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) throw error;
    return session;
  };

  const resetPassword = async (accessToken: string, newPassword: string) => {
    const { user, error } = await supabase.auth.api.updateUser(accessToken, { password: newPassword });
    if (error) throw error;
    return user;
  };

  return {
    session,
    login,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
    // maybeHandleEmailConfirmation,
  };
}
