import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
