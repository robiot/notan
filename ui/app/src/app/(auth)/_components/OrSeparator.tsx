import { Separator } from "@notan/components/ui/separator";

export const OrSeparator = () => {
  return (
    <div className="flex gap-5 w-full items-center">
      <Separator orientation="horizontal" className="flex-1" />
      <span className="text-sm">OR</span>
      <Separator orientation="horizontal" className="flex-1" />
    </div>
  );
};
