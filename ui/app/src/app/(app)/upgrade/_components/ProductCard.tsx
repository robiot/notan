import { Button } from "@notan/components/ui/button";
import Image from "next/image";

export const ProductCard = () => {
  return (
    <div className="flex flex-col gap-0 p-7 rounded-2xl bg-purple-blue-gradient">
      <Image
        alt="storage"
        src="/products/storage.svg"
        width={200}
        height={200}
        className="h-28 self-center"
      />

      <span className="text-xl mt-6 font-semibold">+20 note storage</span>
      <p>Increase note storage by 20 forever.</p>
      <div className="flex justify-between gap-2 mt-4">
        <span className="text-lg font-bold">3.99€</span>
        <span>0/4 bought</span>
      </div>
      <Button variant="inverted" className="bg-white text-black mt-3">
        Buy
      </Button>
    </div>
  );
};
