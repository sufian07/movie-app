import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
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

describe('OmdbService', () => {
    let config: ConfigService;
    let omdbService: OmdbService;
    let movieRepository: Repository<Movie>;

    beforeEach(async () => {
        const moduleRef = await getMoviesModuleMock();
        omdbService = moduleRef.get<OmdbService>(OmdbService);
        config = moduleRef.get<ConfigService>(ConfigService);
    });

    describe('get', () => {
        const omdbDto: OmdbDto = getMockOmdbDto();
        it('should return a Error', async () => {
            const Error = 'Internal server error';
            try {
                jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: { Error } }));
                await omdbService.get(omdbDto.Title);
            } catch (exception) {
                expect(exception).toBeInstanceOf(BadRequestException);
                expect(exception.message).toBe(Error);
            }
        });

        it('should return null', async () => {
            try {
                jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: {} }));
                await omdbService.get(omdbDto.Title);
            } catch (exception) {
                expect(exception).toBeInstanceOf(NotFoundException);
                expect(exception.message).toBe('Movie not found');
            }
        });

        it('should return a OmdbDto', async () => {
            jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: omdbDto }));
            await omdbService.get(omdbDto.Title);
            expect(axios.get).toHaveBeenCalled();
            expect(axios.get).toHaveBeenCalledWith('mock_OMDB_URL', { params: { apikey: 'mock_OMDB_KEY', t: omdbDto.Title, type: 'movie' } });
        });
    });
});
