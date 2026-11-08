import { CoupleSectionNav } from "@/components/couple-section-nav";
import { CareView } from "@/features/care/care-view";

export function Component() {
  return (
    <div className="ms-auto me-auto flex w-full max-w-3xl flex-col gap-6">
      <CoupleSectionNav />
      <CareView />
    </div>
  );
}
