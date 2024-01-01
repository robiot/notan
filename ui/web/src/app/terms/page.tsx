"use client";

import { Container } from "@/components/common/Container";
import { Hero, HeroHeading } from "@/components/common/Hero";

export default function Terms() {
  return (
    <>
      <Hero className="h-[30rem] bg-black flex justify-center">
        <Container size="small" className="h-fit text-center">
          <HeroHeading>Terms of Service</HeroHeading>
        </Container>
      </Hero>
      <Container className="privacyp mt-6">
        <p className="!mb-14">Last updated: January 01, 2024</p>

        <p>
          <strong>Ownership and Copyright:</strong> Robiot exclusively owns the
          copyright for Notan, including all its products, logos, and related
          materials.
        </p>

        <p>
          <strong>Limitation of Liability:</strong> Notan is not liable or
          responsible for any consequences arising from the information
          contained on the platform. By using Notan, you agree that under no
          event shall Notan be liable for any damages.
        </p>

        <p>
          <strong>Product Purchases:</strong> When you make a purchase on Notan,
          you shall receive the product or service as described. However, note
          that digital products may change in the future. If payment is denied,
          Notan reserves the right to attempt to process the transaction again.
        </p>

        <p>
          <strong>User Account Information:</strong> Users are required to
          provide a valid email address when signing up for Notan for billing
          and communication purposes.
        </p>

        <p>
          <strong>User Responsibility:</strong> The user assumes all
          responsibility and risk for the use of Notan. Notan has no liability
          or responsibility to any person.
        </p>

        <p>
          <strong>As-Is Service:</strong> Notan is provided "as is" without any
          warranties or guarantees.
        </p>

        <p>
          <strong>Lawful Use:</strong> Users agree to use Notan only for lawful
          purposes.
        </p>

        <p>
          <strong>Updates to Terms:</strong> These terms may be updated, and the
          date at the top will reflect the last modification.
        </p>

        <p>
          <strong>User-Generated Content:</strong> All notes generated on Notan
          are considered user content, and Notan has no editorial control over
          the notes and content produced by the user.
        </p>

        <p>
          <strong>Platform Availability:</strong> Notan does not guarantee
          constant availability of the platform and assumes no liability for
          downtime.
        </p>

        <p>
          <strong>Security of Data Transmission:</strong> No data transmission
          over the internet can be guaranteed as totally secure. While Notan
          endeavors to protect transmitted information, any information you send
          to Notan is at your own risk.
        </p>

        <p>
          By using Notan, you acknowledge and agree to these terms. If you do
          not agree with these terms, please refrain from using Notan.
        </p>
      </Container>
      <div className="mt-28" />
    </>
  );
}
