import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payload } from '../../auth/interfaces/payload.interface';
import { OmdbDto } from '../dto/omdb.dto';
import { Movie } from '../entities/movie.entity';
import { getMoviesModuleMock } from '../mock/movies-module.mock';
import { getMockUser } from '../mock/user.mock';
import { MoviesService } from './movies.service';
import { OmdbService } from './omdb.service';

describe('MoviesService', () => {
    let moviesService: MoviesService;
    let omdbService: OmdbService;
    let movieRepository: Repository<Movie>;
    let movie: Movie;
    let user: Payload;

    beforeEach(async () => {
        const moduleRef = await getMoviesModuleMock();
        moviesService = moduleRef.get<MoviesService>(MoviesService);
        omdbService = moduleRef.get<OmdbService>(OmdbService);
        movieRepository = moduleRef.get<Repository<Movie>>(getRepositoryToken(Movie));
        user = getMockUser();
    });

    describe('create', () => {
        const movieDto = {
            title: 'test',
        };
        const omdbDto: OmdbDto = {
            Title: 'test',
            Released: new Date('02/02/2013'),
            Genre: 'Horror',
            Director: 'John Doe',
        };
        it('should return a permission error', async () => {
            try {
                await moviesService.create({ ...user, role: 'wrong' }, movieDto);
            } catch (exception) {
                expect(exception).toBeInstanceOf(UnauthorizedException);
                expect(exception.message).toBe('You do not have proper permissions');
            }
        });

        it('should return a count error', async () => {
            try {
                jest.spyOn(movieRepository, 'count').mockReturnValue(Promise.resolve(6));
                await moviesService.create(user, movieDto);
            } catch (exception) {
                expect(exception).toBeInstanceOf(BadRequestException);
                expect(exception.message).toBe('You have created 5 movie this month. To create more movie please upgrade to premium');
            }
        });

        it('should return a created movie', async () => {
            jest.spyOn(omdbService, 'get').mockReturnValue(Promise.resolve(omdbDto));
            expect(await moviesService.create(user, movieDto)).toBe(movie);
            expect(omdbService.get).toHaveBeenCalled();
            expect(omdbService.get).toHaveBeenCalledWith(movieDto.title);
        });
    });

    describe('list', () => {
        it('should return an array of movies', async () => {
            const result = [movie];
            jest.spyOn(moviesService, 'list').mockReturnValue(Promise.resolve(result));
            expect(await moviesService.list(user)).toBe(result);
            expect(moviesService.list).toHaveBeenCalled();
            expect(moviesService.list).toHaveBeenCalledWith(user);
        });
    });
});
