import { Inject, Injectable } from "@nestjs/common";
import type { CatalogData } from "@bookrate/types";
import type { CatalogQuery } from "@bookrate/validators";
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from "./catalog.repository";

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repository: CatalogRepository,
  ) {}

  getCatalog(query: CatalogQuery): Promise<CatalogData> {
    return this.repository.getCatalog(query);
  }
}
