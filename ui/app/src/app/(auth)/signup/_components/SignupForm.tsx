import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { zodRequiredString } from "@/lib/zodPresents";

const FormSchema = z.object({
  email: z
    .string()
    .min(3, "Email must be more than 3 characters")
    .max(64, "Email must be less than 64 characters"),
  username: z
    .string()
    .min(3, "Username must be between 3 and 16 characters")
    .max(16, "Username must be between 3 and 16 characters"),
  password: zodRequiredString,
});

type FormSchemaType = z.infer<typeof FormSchema>;

export const LoginForm = () => {
  const auth = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { setError, register, handleSubmit, formState } =
    useForm<FormSchemaType>({
      resolver: zodResolver(FormSchema),
    });

  const signUp = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: FormSchemaType) => {
      const response = await api
        .post<ApiResponse<{ token: string }>>("/auth/signup", {
          email: data.email,
          username: data.username,
          password: data.password,
        })
        .catch((error: AxiosError) => {
          // Username
          if (hasError(error.response, "username_exists")) {
            setError("username", {
              type: "manual",
              message: "The username is already taken",
            });
          } else if (hasError(error.response, "username_invalid")) {
            setError("username", {
              type: "manual",
              message: "The username contains invalid characters",
            });
          }
          // Password
          else if (hasError(error.response, "password_long")) {
            setError("password", {
              type: "manual",
              message: "Password is too long",
            });
          } else if (hasError(error.response, "password_short")) {
            setError("password", {
              type: "manual",
              message: "The password must be at least 8 characters long",
            });
          }
          // Email
          else if (hasError(error.response, "email_exists")) {
            setError("email", {
              type: "manual",
              message: "An account with this email already exists",
            });
          } else if (hasError(error.response, "email_invalid")) {
            setError("email", {
              type: "manual",
              message: "The specified email is invalid",
            });
          }
        });

      if (!response) return;

      auth.login(response.data.data.token);

      router.push("/");
    },
  });

  return (
    <form
      className="flex flex-col w-full gap-2"
      onSubmit={handleSubmit((values) => {
        signUp.mutate(values);
      })}
    >
      <Input
        placeholderStyle="alwaysVisible"
        placeholder="Email"
        error={formState.errors.email?.message}
        {...register("email")}
      />
      <Input
        placeholderStyle="alwaysVisible"
        placeholder="Username"
        error={formState.errors.username?.message}
        {...register("username")}
      />
      <Input
        placeholderStyle="alwaysVisible"
        placeholder="Password"
        type="password"
        error={formState.errors.password?.message}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        {...register("password")}
      />

      <p className="text-xs text-muted-foreground mb-4 mt-4 text-center">
        By signing up, you agree that you have read our{" "}
        <Link
          href="https://notan.ax/terms"
          className="text-blue-500"
          target="_blank"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="https://notan.ax/privacy"
          className="text-blue-500"
          target="_blank"
        >
          Privacy Policy
        </Link>{" "}
        and that you are agreeing to them.
      </p>
      <Button
        className="mt-2"
        type="submit"
        loading={signUp.isPending}
        disabled={!formState.isDirty}
      >
        Create account
      </Button>
    </form>
  );
};
