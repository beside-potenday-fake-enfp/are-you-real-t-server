import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [QuestionsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
