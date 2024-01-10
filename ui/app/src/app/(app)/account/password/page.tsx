"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@notan/components/ui/alert";
import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ShieldQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/hooks/users/useUser";
import { api } from "@/lib/api";
import { zodPassword } from "@/lib/zodPresents";

import { ItemTitleRow } from "../_components/ItemTitleRow";

const PasswordFormSchema = z.object({
  current_password: z.string(),
  new_password: zodPassword,
});

type PasswordFormSchemaType = z.infer<typeof PasswordFormSchema>;

const AccountPasswordPage = () => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const router = useRouter();
  const user = useUser();

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
      router.push("/account");
    },
  });

  return (
    <>
      <ItemTitleRow>Password</ItemTitleRow>

      {user.data?.is_connected_google && (
        <Alert className="text-sm mb-6">
          <span className="flex gap-3">
            <ShieldQuestion />
            You don't have a password set. If you are using Google, a password
            is not nessicary. Set a password if you want to change your mail.
          </span>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        {!user.data?.is_connected_google && (
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
        )}
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
        <Button
          className="w-full"
          onClick={handleSubmit((data) => {
            console.log("clicked");
            updatePassword.mutate(data);
          })}
          loading={updatePassword.isPending}
          disabled={!isDirty}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default AccountPasswordPage;
