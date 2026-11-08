import { CoupleSectionNav } from "@/components/couple-section-nav";
import { CheckView } from "@/features/check/check-view";

export function Component() {
  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-6">
      <CoupleSectionNav />
      <CheckView />
    </div>
  );
}
