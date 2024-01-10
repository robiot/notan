import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/lib/api";
import { zodRequiredString } from "@/lib/zodPresents";

const UsernameFormSchema = z.object({
  username: zodRequiredString,
});

type UsernameFormSchemaType = z.infer<typeof UsernameFormSchema>;

export const UsernameForm: FC<{ username?: string; onDone: () => void }> = ({
  username,
  onDone,
}) => {
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

      onDone();
    },
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        <Input
          placeholderStyle="alwaysVisible"
          placeholder="Username"
          className="w-full"
          {...register("username")}
          error={errors.username?.message}
        />

        <Button
          type="submit"
          loading={updateUsername.isPending}
          disabled={!isDirty}
          onClick={handleSubmit((data) => {
            updateUsername.mutate(data);
          })}
        >
          Save
        </Button>
      </div>
    </>
  );
};
