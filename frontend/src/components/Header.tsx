// frontend/src/components/Header.tsx

import { UserDisplay } from "@/components/UserDisplay";
import { ContentWrapper } from "@/components/ContentWrapper";

export function Header() {
  return (
    <div className="pb-8">
      <div className="border-b border-gray-700 dark:border-gray-200 light:shadow-sm md:border-none light:md:shadow-none">
        <ContentWrapper>
          <header className="flex-row items-start gap-6 flex justify-between border-accent md:items-end pb-4 md:gap-0 md:flex-row md:border-b">
            <div className="flex flex-col justify-items-start md:flex-row md:items-end md:gap-4">
              <h1 className="text-3xl font-bold">Travel Stream</h1>
              <p className="text-sm italic dark:text-gray-400 text-gray-500 pb-1 md:inline-block">
                Streamline travel planning
              </p>
            </div>
            <UserDisplay />
          </header>
        </ContentWrapper>
      </div>
    </div>
  );
}
