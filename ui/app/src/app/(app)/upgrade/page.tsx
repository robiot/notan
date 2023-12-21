"use client";

import Image from "next/image";

import { Container } from "@/components/common/Container";

export default function UpgradePage() {
  return (
    <Container size="xlarge" className="flex flex-col py-24">
      <div className="flex flex-col gap-4 w-72 p-10 rounded-xl bg-purple-blue-gradient">
        <Image
          alt="storage"
          src="/products/storage.svg"
          width={200}
          height={200}
          className="h-28 self-center"
        />

        <span className="text-xl mt-4 font-semibold">+20 note storage</span>
        <p>Increase note storage by 20 forever.</p>
        <div className="flex justify-between gap-2 mt-6">
          <span className="text-xl font-bold">3.99€</span>
          <span>0/4 bought</span>
        </div>
      </div>
    </Container>
  );
}
