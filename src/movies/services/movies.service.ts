import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/auth/interfaces/payload.interface';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment';
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
    const { userId, role } = user;
    if (role !== 'basic' && role !== 'premium') {
      throw new UnauthorizedException('You do not have proper permissions');
    }
    if (role === 'basic') {
      const start = moment().startOf('month').toDate();
      const end = moment().endOf('month').toDate();
      const count = await this.movieRepository.count({
        where: {
          userId,
          created_at: Between(start, end),
        },
      });
      if (count > 4) {
        throw new BadRequestException(
          'You have created 5 movie this month. To create more movie please upgrade to premium',
        );
      }
    }
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

  async list(user: Payload): Promise<Movie[]> {
    const { userId } = user;
    return this.movieRepository.find({ where: { userId } });
  }
}
