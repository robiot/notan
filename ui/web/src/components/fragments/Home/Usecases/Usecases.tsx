import { Container } from "@/components/common/Container";

import { UsecaseItem } from "./UsecaseItem";

export const HomeUsecasesSection = () => {
  return (
    <Container>
      <div className="flex flex-col flex-1 gap-5">
        <h2 className="font-bold text-4xl text-center">
          Notes as Unique as Your Tabs
        </h2>
        <Container className="max-w-lg text-center">
          <p>
            Notan is a note manager that allows you to create personalized notes
            for each of your active tabs.
          </p>
        </Container>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <UsecaseItem
          title="Research insights"
          description="Capture and organize research findings with precision."
        />
        <UsecaseItem
          title="Favorite Recipes"
          description="Save and revisit your favorite recipes effortlessly."
        />
        <UsecaseItem
          title="Code Snippets"
          description="Annotate and store code snippets for quick reference."
        />
        <UsecaseItem
          title="Creative Ideas"
          description="Record creative ideas that come to you on various web pages."
        />
        <UsecaseItem
          title="Entertainment Notes"
          description="Keep notes related to your entertainment content - movies, music, and more."
        />
        <UsecaseItem
          title="Project Details"
          description="Store project-specific details, tasks, and milestones."
        />
      </div>
    </Container>
  );
};
