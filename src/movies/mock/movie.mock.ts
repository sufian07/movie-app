import { Payload } from 'src/auth/interfaces/payload.interface';
import { OmdbDto } from '../dto/omdb.dto';
import { Movie } from '../entities/movie.entity';

export const getMockOmdbDto = (): OmdbDto => ({
    Title: 'test',
    Released: new Date('02/02/2013'),
    Genre: 'Horror',
    Director: 'John Doe',
});

export const getMockMovie = (omdbDto: OmdbDto, user: Payload): Movie => ({
    id: 1,
    title: omdbDto.Title,
    released: new Date(omdbDto.Released),
    genre: omdbDto.Genre,
    director: omdbDto.Director,
    userId: user.userId,
    created_at: new Date(),
    updated_at: new Date(),
});
