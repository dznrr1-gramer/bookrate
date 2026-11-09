import "@bookrate/ui";
import "@bookrate/validators";
import type { BookRating, ReadingStatus, ViewerRole } from "@bookrate/types";

export type WorkspacePackageSmoke = {
  rating: BookRating;
  readingStatus: ReadingStatus;
  viewerRole: ViewerRole;
};
