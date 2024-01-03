"use client";

import { HomeAnywhereSection } from "@/components/fragments/Home/Anywhere/Anywhere";
import { HomeBrowsersSection } from "@/components/fragments/Home/Browsers/Browsers";
import { HomeFaqSection } from "@/components/fragments/Home/Faq/Faq";
import { HomeJoinSection } from "@/components/fragments/Home/Join/Join";
// import { HomeJoinSection } from "@/components/fragments/Home/Join/Join";
import { NotesLikeBookmarksSection } from "@/components/fragments/Home/NotesLikeBookmarks/NotesLikeBookmarks";
import { HomePricingSection } from "@/components/fragments/Home/Pricing/Pricing";
import { HomeSearchSection } from "@/components/fragments/Home/Search/Search";
import { HomeTopSection } from "@/components/fragments/Home/Top/Top";

export default function Home() {
  return (
    <>
      <HomeTopSection />
      <HomeBrowsersSection />
      <NotesLikeBookmarksSection />
      <HomeSearchSection />
      <HomeAnywhereSection />
      <HomePricingSection />
      <HomeFaqSection />
      <HomeJoinSection />
    </>
  );
}
