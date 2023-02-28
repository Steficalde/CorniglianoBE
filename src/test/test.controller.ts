import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './test.service';


@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}


  @Get('retest')
  reset() {
    this.testService.reset();
    return "porcoiltudio";
  }

}
