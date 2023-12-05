import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Container } from "@/core/popup/components/app/Container";
import { Input } from "@/core/popup/components/ui/input";
import { toast } from "@/core/popup/components/ui/use-toast";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";
import { zodPassword } from "@/core/popup/lib/zodPresents";

import { ProfileSettingTopbar } from "../_components/ProfileSettingTopbar";

const PasswordFormSchema = z.object({
  current_password: zodPassword,
  new_password: zodPassword,
});

type PasswordFormSchemaType = z.infer<typeof PasswordFormSchema>;

export const ProfilePasswordPage = () => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    setError,
  } = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(PasswordFormSchema),
  });

  const updatePassword = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: async (data: PasswordFormSchemaType) => {
      const response = await api
        .put<ApiResponse<unknown>>("/users/@me/password", {
          current_password: data.current_password,
          new_password: data.new_password,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "unauthorized")) {
            setError("current_password", {
              type: "manual",
              message: "The current password is incorrect",
            });
          }
        });

      if (!response) return;

      toast({
        title: "Password updated",
        description: "Your password has been updated",
      });
      navigate("/profile");
    },
  });

  return (
    <>
      <ProfileSettingTopbar
        onSave={handleSubmit((data) => {
          updatePassword.mutate(data);
        })}
        loading={updatePassword.isPending}
        canSave={isDirty}
      />

      <Container>
        <h1 className="my-5 text-center text-2xl font-bold">Password</h1>
        <div className="flex flex-col gap-2">
          <Input
            placeholderStyle="alwaysVisible"
            placeholder="Current password"
            className="w-full"
            type="password"
            showPassword={currentPasswordVisible}
            setShowPassword={setCurrentPasswordVisible}
            {...register("current_password")}
            error={errors.current_password?.message}
          />
          <Input
            placeholderStyle="alwaysVisible"
            placeholder="New password"
            className="w-full"
            type="password"
            showPassword={newPasswordVisible}
            setShowPassword={setNewPasswordVisible}
            {...register("new_password")}
            error={errors.new_password?.message}
          />
        </div>
      </Container>
    </>
  );
};
