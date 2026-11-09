import { Inject, Injectable } from "@nestjs/common";
import type { HomepageData } from "@bookrate/types";
import {
  HOMEPAGE_REPOSITORY,
  type HomepageRepository,
} from "./homepage.repository";

@Injectable()
export class HomepageService {
  constructor(
    @Inject(HOMEPAGE_REPOSITORY)
    private readonly repository: HomepageRepository,
  ) {}

  getHomepageData(): Promise<HomepageData> {
    return this.repository.getHomepageData();
  }
}
