import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { CommentsModule } from './comments/comments.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [QuestionsModule, CommentsModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
