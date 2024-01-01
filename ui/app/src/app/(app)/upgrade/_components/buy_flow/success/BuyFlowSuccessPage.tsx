import { AlertDialogAction } from "@notan/components/ui/alert-dialog";
import { Button } from "@notan/components/ui/button";
import { Separator } from "@notan/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const BuyFlowSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-7">
      <div className="w-full flex rounded-xl mt-4 text-green-600">
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <CheckCircle className="h-10 w-10" />
          <div className="text-2xl text-white">Payment successful</div>
        </div>
      </div>

      <Separator />
      <div className="flex flex-col items-center text-center">
        <div className="text-xl">Thank you for your purchase!</div>
        <div className="text-sm mt-3">
          You can now start using your new features ✨
        </div>
        <AlertDialogAction asChild>
          <Button
            className="mt-12 px-12 w-fit"
            onClick={() => {
              // remove all query params
              router.push("/upgrade");
            }}
          >
            Done
          </Button>
        </AlertDialogAction>
      </div>
    </div>
  );
};
