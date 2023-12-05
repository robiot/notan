import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Container } from "@/core/popup/components/app/Container";
import { Input } from "@/core/popup/components/ui/input";
import { useUser } from "@/core/popup/hooks/user/useUser";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";
import { zodRequiredString } from "@/core/popup/lib/zodPresents";

import { ProfileSettingTopbar } from "../_components/ProfileSettingTopbar";

const EmailFormSchema = z.object({
  email: zodRequiredString,
});

type EmailFormSchemaType = z.infer<typeof EmailFormSchema>;

const ProfileEmailContent: FC<{ email: string }> = ({ email }) => {
  const navigate = useNavigate();

  const {
    formState: { isDirty, errors },
    setError,
    register,
    handleSubmit,
  } = useForm<EmailFormSchemaType>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email,
    },
  });

  const updateUsername = useMutation({
    mutationKey: ["updateEmail"],
    mutationFn: async (data: EmailFormSchemaType) => {
      const response = await api
        .put<ApiResponse<unknown>>("/users/@me/email", {
          email: data.email,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "email_exists")) {
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

      navigate("/profile");
    },
  });

  return (
    <>
      <ProfileSettingTopbar
        onSave={handleSubmit((data) => {
          updateUsername.mutate(data);
        })}
        loading={updateUsername.isPending}
        canSave={isDirty}
      />

      <Container>
        <h1 className="my-5 text-center text-2xl font-bold">Email</h1>
        <div className="flex flex-col gap-2">
          <Input
            placeholderStyle="alwaysVisible"
            placeholder="Email"
            className="w-full"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
      </Container>
    </>
  );
};

export const ProfileEmailPage = () => {
  const user = useUser();

  if (user.isLoading) return <span>Loading</span>;

  return <ProfileEmailContent email={user.data.email} />;
};
