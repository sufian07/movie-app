import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { request } from 'http';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CreateDto } from '../dto/movies.dto';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../services/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() request, @Body() dto: CreateDto): Promise<Movie> {
    return this.moviesService.create(request.user, dto);
  }

  @Get()
  async list(): Promise<Movie[]> {
    return this.moviesService.list();
  }
}
