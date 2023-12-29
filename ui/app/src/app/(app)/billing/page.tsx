"use client";

import { Container } from "@/components/common/Container";
import { PageTitle } from "@/components/common/PageTitle";

import { BillingActiveSubscriptions } from "./_components/ActiveSubscription/BillingActiveSubscription";
import { BillingPaymentMethods } from "./_components/PaymentMethods/BillingPaymentMethods";

export default function UpgradePage() {
  return (
    <Container size="small" className="flex flex-col">
      <div className="mt-5">
        <PageTitle>Payment methods</PageTitle>
        <BillingPaymentMethods />
      </div>
      <div className="mt-10">
        <p className="text-2xl font-bold mb-7">Active subscription</p>
        <BillingActiveSubscriptions />
      </div>
    </Container>
  );
}
