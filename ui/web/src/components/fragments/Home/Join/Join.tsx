import { DownloadButton } from "@/components/assembled/navbar/DownloadButton";
import { Container } from "@/components/common/Container";

export const HomeJoinSection = () => {
  return (
    <Container className="my-0 py-36">
      <div className="text-background rounded-xl bg-blue-gradient p-14 flex gap-5 gap-y-14 flex-col items-center">
        <h2 className="font-bold text-4xl text-center">Join Notan Today</h2>
        <Container className="max-w-2xl" noPadding>
          <p className="text-center">
            Ready to transform the way you take notes? Download Notan today and
            experience the power of seamless, page-specific note-taking. Elevate
            your browsing, boost productivity, and make your notes work for you.
          </p>
        </Container>
        <DownloadButton />
      </div>
    </Container>
  );
};
