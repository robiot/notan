import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { zodRequiredString } from "@/lib/zodPresents";

const FormSchema = z.object({
  email: zodRequiredString,
  password: zodRequiredString,
});

type FormSchemaType = z.infer<typeof FormSchema>;

export const LoginForm = () => {
  const auth = useAuth();
  // const navigate = useNavigate();
  const router = useRouter();
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

      auth.login(response.data.data.token);

      router.push("/");
    },
  });

  return (
    <form
      className="mt-3 flex flex-col w-full gap-2"
      onSubmit={handleSubmit((values) => {
        login.mutate(values);
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
        placeholder="Password"
        type="password"
        error={formState.errors.password?.message}
        className="pr-11"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        {...register("password")}
      />

      <Button
        className="mt-2"
        type="submit"
        loading={login.isPending}
        disabled={!formState.isValid}
      >
        Sign in
      </Button>
    </form>
  );
};
