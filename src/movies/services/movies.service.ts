import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/auth/interfaces/payload.interface';
import { Repository } from 'typeorm';
import { CreateDto } from '../dto/movies.dto';
import { OmdbDto } from '../dto/omdb.dto';
import { Movie } from '../entities/movie.entity';
import { OmdbService } from './omdb.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly omdbService: OmdbService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(user: Payload, dto: CreateDto): Promise<Movie> {
    const { userId } = user;
    const movie: OmdbDto = await this.omdbService.get(dto.title);
    let createdMovie: Movie;
    const { Title: title, Released, Genre: genre, Director: director } = movie;
    const released = new Date(Released);
    createdMovie = await this.movieRepository.findOne({
      where: {
        title,
        released,
        genre,
        director,
        userId,
      },
    });
    if (!createdMovie) {
      createdMovie = await this.movieRepository.save({
        title,
        released,
        genre,
        director,
        userId,
      });
    }
    return createdMovie;
  }

  async list(): Promise<Movie[]> {
    return this.movieRepository.find();
  }
}
