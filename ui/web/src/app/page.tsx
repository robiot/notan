"use client";

import { HomeAnywhereSection } from "@/components/fragments/Home/Anywhere/Anywhere";
import { HomeBrowsersSection } from "@/components/fragments/Home/Browsers/Browsers";
// import { HomeJoinSection } from "@/components/fragments/Home/Join/Join";
import { NotesLikeBookmarksSection } from "@/components/fragments/Home/NotesLikeBookmarks/NotesLikeBookmarks";
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
      {/* <HomeJoinSection /> */}
    </>
  );
}
