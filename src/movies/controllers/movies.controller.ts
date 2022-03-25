import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from '../dto/movies.dto';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../services/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Post()
  async create(@Body() data: CreateDto): Promise<Movie> {
    return this.moviesService.create(data);
  }
}
