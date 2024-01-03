import { DownloadButton } from "@/components/assembled/navbar/DownloadButton";
import { Container } from "@/components/common/Container";

export const HomeJoinSection = () => {
  return (
    <Container className="pt-16 mb-52">
      <div className="rounded-3xl bg-blue-gradient p-14 flex gap-5 gap-y-14 flex-col items-center">
        <h2 className="font-bold text-4xl text-center">
          Get Notan and start writing today
        </h2>
        <DownloadButton inverted />
      </div>
    </Container>
  );
};
