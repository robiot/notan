import { Bookmark, RefreshCw } from "lucide-react";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

import { InfoCard } from "./InfoCard";

export const NotesLikeBookmarksSection = () => {
  return (
    <section className="my-28">
      <Container size="small" className="text-center flex flex-col gap-8">
        <SectionHeading>Notes like Bookmarks</SectionHeading>
        <p className="text-base leading-relaxed">
          In Notan all of your notes are created per page, just like a bookmark.
          But it's not just a bookmark, it is a place to write down notes with
          ease and never forget where you saved them.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-9">
          <InfoCard icon={<Bookmark />} title="Organized by default">
            All notes created in Notan are automatically organized by website
            allowing you to focus on more important tasks.
          </InfoCard>

          <InfoCard icon={<RefreshCw />} title="Synced across devices">
            Notan ensures seamless access to your organized notes from any
            computer device with the extension installed.
          </InfoCard>
        </div>
      </Container>
    </section>
  );
};
