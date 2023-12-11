import Image from "next/image";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

export const HomeElevateWorkflowSection = () => {
  return (
    <div className="bg-muted">
      <Container className="py-24">
        <div className="flex gap-5 gap-y-14 flex-col-reverse sm:flex-row">
          <div className="flex flex-col flex-1 gap-5">
            <SectionHeading>Elevate Your Workflow</SectionHeading>
            <p>
              Effortlessly enhance your productivity with Notan. Seamlessly
              transition between tasks while keeping notes for your current tab.
              Stay focused and organized as you navigate through different tabs,
              making the most out of your browsing experience.
            </p>
          </div>

          <div className="flex flex-1 justify-center sm:justify-end">
            <Image
              src="/general/website.svg"
              alt="elevate workflow"
              className="w-80"
              width={949.85}
              height={463.64}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
