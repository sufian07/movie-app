import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDto } from '../dto/movies.dto';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../services/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() dto: CreateDto): Promise<Movie> {
    return this.moviesService.create(dto);
  }

  @Get()
  async list(): Promise<Movie[]> {
    return this.moviesService.list();
  }
}
