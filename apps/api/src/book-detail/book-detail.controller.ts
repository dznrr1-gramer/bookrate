import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  reviewQuerySchema,
  slugSchema,
  type ReviewQuery,
} from "@bookrate/validators";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { BookDetailService } from "./book-detail.service";

@ApiTags("books")
@Controller("books")
export class BookDetailController {
  constructor(private readonly bookDetail: BookDetailService) {}

  @Get(":slug")
  @ApiOperation({
    summary: "Get public book metadata, reviews, and related books",
  })
  getBookDetail(
    @Param("slug", new ZodValidationPipe(slugSchema)) slug: string,
    @Query(new ZodValidationPipe(reviewQuerySchema))
    query: ReviewQuery,
  ) {
    return this.bookDetail.getBookDetail(slug, query);
  }
}
