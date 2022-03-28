import { CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guards';
import { MoviesController } from '../controllers/movies.controller';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../services/movies.service';
import { OmdbService } from '../services/omdb.service';
import { ConfigServiceMock } from './config-service.mock';
import { modelMock } from './model.mock';

export const getMoviesModuleMock = async () => {
    const jwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
    return await Test.createTestingModule({
        controllers: [MoviesController],
        providers: [
            MoviesService,
            OmdbService,
            {
                provide: getRepositoryToken(Movie),
                useValue: modelMock(),
            },
            {
                provide: ConfigService,
                useClass: ConfigServiceMock,
            },
        ],
    })
        .overrideGuard(JwtAuthGuard)
        .useValue(jwtAuthGuard)
        .compile();
};
