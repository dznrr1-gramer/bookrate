import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HomepageService } from "./homepage.service";

@ApiTags("homepage")
@Controller("homepage")
export class HomepageController {
  constructor(private readonly homepage: HomepageService) {}

  @Get()
  @ApiOperation({ summary: "Get public discovery content for the homepage" })
  getHomepageData() {
    return this.homepage.getHomepageData();
  }
}
