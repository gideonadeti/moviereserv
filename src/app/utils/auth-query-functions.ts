import axios from "../libs/axios-instance";
import type { SignInFormValues, SignUpFormValues } from "../types/auth";

export const signUp = async (signUpFormValues: SignUpFormValues) => {
  try {
    const response = await axios.post("/auth/sign-up", signUpFormValues);

    return response.data;
  } catch (error) {
    console.error("Error from `signUp`:", error);
    throw error;
  }
};

export const signIn = async (signInFormValues: SignInFormValues) => {
  try {
    const response = await axios.post("/auth/sign-in", signInFormValues);

    return response.data;
  } catch (error) {
    console.error("Error from `signIn`:", error);
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post("/auth/refresh");

    return response.data;
  } catch (error) {
    console.error("Error from `refreshAccessToken`:", error);

    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await axios.post("/auth/sign-out");

    return response.data;
  } catch (error) {
    console.error("Error from `signOut`:", error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axios.post("/auth/delete-account");

    return response.data;
  } catch (error) {
    console.error("Error from `deleteAccount`:", error);
    throw error;
  }
};
