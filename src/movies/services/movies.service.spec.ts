import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { use } from 'passport';
import { Repository } from 'typeorm';
import { Payload } from '../../auth/interfaces/payload.interface';
import { OmdbDto } from '../dto/omdb.dto';
import { Movie } from '../entities/movie.entity';
import { getMockMovie, getMockOmdbDto } from '../mock/movie.mock';
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
        const omdbDto: OmdbDto = getMockOmdbDto();
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
            movie = getMockMovie(omdbDto, user);
            const { title, released, genre, director, userId } = movie;
            jest.spyOn(omdbService, 'get').mockReturnValue(Promise.resolve(omdbDto));
            jest.spyOn(movieRepository, 'findOne').mockReturnValue(Promise.resolve(null));
            jest.spyOn(movieRepository, 'save').mockReturnValue(Promise.resolve(movie));

            expect(await moviesService.create(user, movieDto)).toBe(movie);
            expect(omdbService.get).toHaveBeenCalled();
            expect(omdbService.get).toHaveBeenCalledWith(movieDto.title);
            expect(movieRepository.findOne).toHaveBeenCalled();
            expect(movieRepository.findOne).toHaveBeenCalledWith({ where: { title, released, genre, director, userId } });
            expect(movieRepository.save).toHaveBeenCalled();
            expect(movieRepository.save).toHaveBeenCalledWith({ title, released, genre, director, userId });
        });

        it('should return an existing movie', async () => {
            movie = getMockMovie(omdbDto, user);
            jest.spyOn(omdbService, 'get').mockReturnValue(Promise.resolve(omdbDto));
            jest.spyOn(movieRepository, 'findOne').mockReturnValue(Promise.resolve(movie));

            expect(await moviesService.create(user, movieDto)).toBe(movie);
            expect(omdbService.get).toHaveBeenCalled();
            expect(omdbService.get).toHaveBeenCalledWith(movieDto.title);
            expect(movieRepository.findOne).toHaveBeenCalled();
            expect(movieRepository.save).not.toHaveBeenCalled();
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
