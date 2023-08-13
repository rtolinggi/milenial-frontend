import { AxiosError } from "axios";
import { instance } from "./axios.api";
import { InputSignIn, InputSignUp } from "./type.api";

export const GetSession = async () => {
  try {
    const result = await instance.get('auth/token');
    const response = await result.data;
    return response;
  } catch (error) {
    const err = error as AxiosError;
    throw err.response?.data
  }
}

export const SignOut = async () => {
  try {
    const res = await instance.get('auth/signout');
    const result = await res.data;
    return result;
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data;
  }
}

export const SignIn = async (input: InputSignIn) => {
  try {
    const res = await instance.post('/auth/signin', input);
    const result = await res.data;
    return result;
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data;
  }
};

export const SignUp = async (payload: InputSignUp) => {
  try {
    const result = await instance.post('auth/signup', payload);
    const response = await result.data;
    return response;
  } catch (error) {
    const err = error as AxiosError;
    throw err.response?.data;
  }

}