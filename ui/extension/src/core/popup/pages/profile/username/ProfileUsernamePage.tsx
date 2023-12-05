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

const UsernameFormSchema = z.object({
  username: zodRequiredString,
});

type UsernameFormSchemaType = z.infer<typeof UsernameFormSchema>;

const ProfileUsernameContent: FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();

  const {
    formState: { isDirty, errors },
    setError,
    register,
    handleSubmit,
  } = useForm<UsernameFormSchemaType>({
    resolver: zodResolver(UsernameFormSchema),
    defaultValues: {
      username,
    },
  });

  const updateUsername = useMutation({
    mutationKey: ["updateUsername"],
    mutationFn: async (data: UsernameFormSchemaType) => {
      const response = await api
        .put<ApiResponse<unknown>>("/users/@me/username", {
          username: data.username,
        })
        .catch((error: AxiosError) => {
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
        <h1 className="my-5 text-center text-2xl font-bold">Username</h1>
        <div className="flex flex-col gap-2">
          <Input
            placeholderStyle="alwaysVisible"
            placeholder="Username"
            className="w-full"
            {...register("username")}
            error={errors.username?.message}
          />
        </div>
      </Container>
    </>
  );
};

export const ProfileUsernamePage = () => {
  const user = useUser();

  if (user.isLoading) return <span>Loading</span>;

  return <ProfileUsernameContent username={user.data.username} />;
};
