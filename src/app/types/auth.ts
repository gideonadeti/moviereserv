import type { z } from "zod";

import type {
  signInFormSchema,
  signUpFormSchema,
} from "../libs/auth-form-schemas";

export interface SignUpInResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = "ADMIN",
  NADMIN = "NADMIN",
}

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignInFormValues = z.infer<typeof signInFormSchema>;
