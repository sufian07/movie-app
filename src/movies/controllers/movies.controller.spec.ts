import { Payload } from '../../auth/interfaces/payload.interface';
import { Movie } from '../entities/movie.entity';
import { getMoviesModuleMock } from '../mock/movies-module.mock';
import { getMockUser } from '../mock/user.mock';
import { MoviesService } from '../services/movies.service';
import { MoviesController } from './movies.controller';

describe('MoviesController', () => {
    let moviesController: MoviesController;
    let moviesService: MoviesService;
    let movie: Movie;
    let request;
    let user: Payload;

    beforeEach(async () => {
        const moduleRef = await getMoviesModuleMock();
        moviesService = moduleRef.get<MoviesService>(MoviesService);
        moviesController = moduleRef.get<MoviesController>(MoviesController);
        user = getMockUser();
        request = { user };
    });

    describe('create', () => {
        it('should return a created movie', async () => {
            const movieDto = {
                title: 'test',
            };
            jest.spyOn(moviesService, 'create').mockReturnValue(Promise.resolve(movie));
            expect(await moviesController.create(request, movieDto)).toBe(movie);
            expect(moviesService.create).toHaveBeenCalled();
            expect(moviesService.create).toHaveBeenCalledWith(user, movieDto);
        });
    });

    describe('list', () => {
        it('should return an array of movies', async () => {
            const result = [movie];
            jest.spyOn(moviesService, 'list').mockReturnValue(Promise.resolve(result));
            expect(await moviesController.list(request)).toBe(result);
            expect(moviesService.list).toHaveBeenCalled();
            expect(moviesService.list).toHaveBeenCalledWith(user);
        });
    });
});
