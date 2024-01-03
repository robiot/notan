import { Button } from "@notan/components/ui/button";
import Link from "next/link";

import { Container } from "@/components/common/Container";
import { MailButton } from "@/components/common/MailButton";

import { OptionItem } from "./OptionItem";

export const ContactOptionsSection = () => {
  return (
    <section className="my-24 mb-64">
      <Container size="small" className="text-center flex flex-col gap-9">
        <div className="grid sm:grid-cols-2 xl:grid-cols-2 sm:gap-y-24 gap-16">
          <OptionItem
            title="Billing"
            description="If you are having problems related to billing. Please contact us and describe your issue."
          >
            <MailButton mailType="billing" />
          </OptionItem>
          <OptionItem
            title="Other"
            description="If you are having other problems. Please contact us and describe your issue."
          >
            <MailButton mailType="info" />
          </OptionItem>
          <OptionItem
            title="I found a bug"
            description="If you found a bug or want to report feedback, please do that using this button."
          >
            <Button className="w-fit px-7" asChild>
              <Link
                href={"https://forms.gle/3ucgQ8bwBa86iUPp8"}
                target="_blank"
              >
                Report a bug / Feedback
              </Link>
            </Button>
          </OptionItem>
        </div>
      </Container>
    </section>
  );
};
