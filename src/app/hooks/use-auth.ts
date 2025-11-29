import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  SignInFormValues,
  SignUpFormValues,
  SignUpInResponse,
} from "../types/auth";
import { signIn, signUp } from "../utils/auth-query-functions";
import useAccessToken from "./use-access-token";

const useAuth = () => {
  const { setAccessToken } = useAccessToken();

  const signUpMutation = useMutation<
    SignUpInResponse,
    AxiosError<{ message: string }>,
    {
      signUpFormValues: SignUpFormValues;
    }
  >({
    mutationFn: async ({ signUpFormValues }) => {
      return signUp(signUpFormValues);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to sign up";

      toast.error(message, { id: "sign-up-error" });
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);

      toast.success("Signed up successfully", { id: "sign-up-success" });
    },
  });

  const signInMutation = useMutation<
    SignUpInResponse,
    AxiosError<{ message: string }>,
    { signInFormValues: SignInFormValues }
  >({
    mutationFn: async ({ signInFormValues }) => {
      return signIn(signInFormValues);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to sign in";

      toast.error(message, { id: "sign-in-error" });
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      toast.success("Signed in successfully", { id: "sign-in-success" });
    },
  });

  return {
    signUpMutation,
    signInMutation,
  };
};

export default useAuth;
