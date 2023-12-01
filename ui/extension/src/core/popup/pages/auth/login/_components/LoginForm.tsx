import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/core/popup/components/ui/button";
import { Input } from "@/core/popup/components/ui/input";
import { toast } from "@/core/popup/components/ui/use-toast";
import { useAuth } from "@/core/popup/hooks/persist/useAuth";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";
import { zodRequiredString } from "@/core/popup/lib/zodPresents";

const FormSchema = z.object({
  email: zodRequiredString,
  password: zodRequiredString,
});

type FormSchemaType = z.infer<typeof FormSchema>;

export const LoginForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: FormSchemaType) => {
      const response = await api
        .post<ApiResponse<{ token: string }>>("/auth/login", {
          email: data.email,
          password: data.password,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "unauthorized")) {
            toast({
              title: "Unauthorized",
              variant: "destructive",
              description: "The email or password you entered is incorrect",
            });
          }
        });

      if (!response) return;

      auth.login({ token: response.data.data.token });

      navigate("/");
    },
  });

  return (
    <form
      className="mt-3 flex flex-col w-full gap-2"
      onSubmit={handleSubmit((values) => {
        login.mutate(values);
      })}>
      <Input placeholder="Email" error={formState.errors.email?.message} {...register("email")} />

      <Input
        placeholder="Password"
        type="password"
        error={formState.errors.password?.message}
        className="pr-11"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        {...register("password")}
      />

      <Button className="mt-2" type="submit" loading={login.isPending} disabled={!formState.isValid}>
        Sign in
      </Button>
    </form>
  );
};
