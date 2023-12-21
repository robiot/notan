"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/hooks/users/useUser";
import { api } from "@/lib/api";
import { zodRequiredString } from "@/lib/zodPresents";

import { ItemTitleRow } from "../_components/ItemTitleRow";

// import { ProfileSettingTopbar } from "../_components/ProfileSettingTopbar";

const EmailFormSchema = z.object({
  email: zodRequiredString,
});

type EmailFormSchemaType = z.infer<typeof EmailFormSchema>;

const AccountEmailContent: FC<{ email?: string }> = ({ email }) => {
  // const navigate = useNavigate();
  const router = useRouter();

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

      router.push("/account");
    },
  });

  return (
    <>
      <ItemTitleRow>Email</ItemTitleRow>
      <div className="flex flex-col gap-2">
        <Input
          placeholderStyle="alwaysVisible"
          placeholder="Email"
          className="w-full"
          {...register("email")}
          error={errors.email?.message}
        />

        <Button
          className="w-full"
          onClick={handleSubmit((data) => {
            updateUsername.mutate(data);
          })}
          loading={updateUsername.isPending}
          disabled={!isDirty}
        >
          Save
        </Button>
      </div>
    </>
  );
};

const AccountEmailPage = () => {
  const user = useUser();

  if (user.isLoading) return <span>Loading</span>;

  return <AccountEmailContent email={user.data?.email} />;
};

export default AccountEmailPage;
