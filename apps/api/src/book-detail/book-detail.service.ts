import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { BookDetailData } from "@bookrate/types";
import type { ReviewQuery } from "@bookrate/validators";
import {
  BOOK_DETAIL_REPOSITORY,
  type BookDetailRepository,
} from "./book-detail.repository";

@Injectable()
export class BookDetailService {
  constructor(
    @Inject(BOOK_DETAIL_REPOSITORY)
    private readonly repository: BookDetailRepository,
  ) {}

  async getBookDetail(
    slug: string,
    query: ReviewQuery,
  ): Promise<BookDetailData> {
    const bookDetail = await this.repository.getBookDetail(slug, query);
    if (!bookDetail) {
      throw new NotFoundException({
        code: "BOOK_NOT_FOUND",
        message: "Book not found.",
      });
    }

    return bookDetail;
  }
}
