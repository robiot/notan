import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

  const { register, handleSubmit, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const login = useMutation({
    mutationKey: ["partner_login"],
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

      const { dismiss } = toast({
        title: "Hold tight",
        description: "You are being signed in",
      });

      (async () => {
        await new Promise((r) => setTimeout(r, 1000));
        dismiss();
      })();

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
        {...register("password")}
      />

      <Button className="mt-2" type="submit" loading={login.isPending}>
        Sign in
      </Button>
    </form>
  );
};
