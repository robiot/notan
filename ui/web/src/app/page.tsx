"use client";

import { HomeBrowsersSection } from "@/components/fragments/Home/Browsers/Browsers";
import { HomeElevateWorkflowSection } from "@/components/fragments/Home/ElevateWorkflow/ElevateWorkflow";
import { HomeJoinSection } from "@/components/fragments/Home/Join/Join";
import { HomeSyncSection } from "@/components/fragments/Home/Sync/Sync";
import { HomeTopSection } from "@/components/fragments/Home/Top/Top";
import { HomeUsecasesSection } from "@/components/fragments/Home/Usecases/Usecases";

export default function Home() {
  return (
    <>
      <HomeTopSection />
      <HomeBrowsersSection />
      <HomeElevateWorkflowSection />
      <HomeSyncSection />
      <HomeUsecasesSection />
      <HomeJoinSection />
    </>
  );
}
