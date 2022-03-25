import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './controllers/movies.controller';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './services/movies.service';
import { OmdbService } from './services/omdb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [MoviesService, OmdbService],
  controllers: [MoviesController],
})
export class MoviesModule {}
