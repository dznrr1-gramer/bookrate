import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  reviewCreateSchema,
  type ReviewCreateInput,
} from "@bookrate/validators";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";

@ApiTags("development")
@Controller("validation")
export class ValidationController {
  @Post("reviews")
  @ApiOperation({
    summary: "Validate a review request without persisting it (development only)",
  })
  validateReview(
    @Body(new ZodValidationPipe(reviewCreateSchema))
    review: ReviewCreateInput,
  ) {
    return { valid: true as const, data: review };
  }
}
