import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, PrismaService],
})
export class ResultsModule {}
