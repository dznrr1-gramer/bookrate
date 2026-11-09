import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { catalogQuerySchema, type CatalogQuery } from "@bookrate/validators";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CatalogService } from "./catalog.service";

@ApiTags("catalog")
@Controller("books")
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOperation({ summary: "Search and filter the public book catalog" })
  getCatalog(
    @Query(new ZodValidationPipe(catalogQuerySchema))
    query: CatalogQuery,
  ) {
    return this.catalog.getCatalog(query);
  }
}
