import Image from "next/image";

import { Container } from "@/components/common/Container";

export const HomeSyncSection = () => {
  return (
    <div>
      <Container className="py-36">
        <div className="flex gap-5 gap-y-14 flex-col sm:flex-row">
          <div className="flex flex-1 justify-center sm:justify-start">
            <Image
              src="/general/hello.svg"
              alt="elevate workflow"
              className="w-80"
              width={949.85}
              height={463.64}
            />
          </div>
          <div className="flex flex-col flex-1 gap-5 justify-end">
            <h2 className="font-bold text-4xl">Synced Across Devices</h2>
            <p>
              Your notes seamlessly travel with you across computer devices,
              ensuring you have access to your notes wherever you go. Stay in
              sync effortlessly and never miss a beat.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};
