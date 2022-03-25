import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(dto: CreateDto): Promise<Movie> {
    const movie: OmdbDto = await this.omdbService.get(dto.title);
    let createdMovie: Movie;
    const {
      Title: title,
      Released: released,
      Genre: genre,
      Director: director,
    } = movie;
    createdMovie = await this.movieRepository.findOne({
      where: {
        title,
        released: new Date(released),
        genre,
        director,
      },
    });
    if (!createdMovie) {
      createdMovie = await this.movieRepository.save({
        title,
        released: new Date(released),
        genre,
        director,
      });
    }
    return createdMovie;
  }

  async list(): Promise<Movie[]> {
    return this.movieRepository.find();
  }
}
