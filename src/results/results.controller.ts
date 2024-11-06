import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // GET /results/:id - 결과지 상세 반환
  @Get('/:id')
  getTestResultById(@Param('id') id: string) {
    return this.resultsService.getTestResultById(id);
  }

  // POST /results - 결과지 생성(결과지 id 반환)
  @Post('/')
  createResult(
    @Body() body: { answerId: number[]; testerId: string; prevMbti: string },
  ) {
    return this.resultsService.createResult(body);
  }
}
