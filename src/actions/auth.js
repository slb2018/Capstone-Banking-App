import { SIGN_IN, SIGN_OUT, BASE_API_URL } from '../utils/constants';
import { initiateGetProfile } from './profile';
import { history } from '../router/AppRouter';
import { getErrors } from './errors';
import { post } from '../utils/api';

export const signIn = (user) => ({
  type: SIGN_IN,
  user
});

export const initiateLogin = (email, password) => {
  return async (dispatch) => {
    try {
      const result = await post(`${BASE_API_URL}/signin`, {
        email,
        password
      });
      const user = result.data;
      user.isAuthenticated = true;
      dispatch(signIn(user));
      dispatch(initiateGetProfile(user.email));
      history.push('/profile');
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const registerNewUser = (data) => {
  return async (dispatch) => {
    try {
      await post(`${BASE_API_URL}/signup`, data);
      return { success: true };
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
      return { success: false };
    }
  };
};

export const signOut = () => ({
  type: SIGN_OUT
});

export const initiateLogout = () => {
  return async (dispatch) => {
    try {
      await post(`${BASE_API_URL}/logout`, true, true);
      localStorage.removeItem('user_token');
      return dispatch(signOut());
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};
