import type {
  Catalog,
  Movie,
  SeatAvailability,
  ShowtimeDetails
} from "../domain/catalog-types.js";
import { ApplicationError, invalidCatalog } from "../domain/errors.js";
import { projectSeatAvailability } from "../domain/seat-availability.js";
import type { CatalogRepository, StateReader } from "./ports.js";

function copyMovie(movie: Movie): Movie {
  return movie.classification === undefined
    ? { id: movie.id, title: movie.title }
    : { id: movie.id, title: movie.title, classification: movie.classification };
}

export function listMovies(catalog: Catalog): readonly Movie[] {
  return catalog.movies.map(copyMovie);
}

export function listShowtimes(catalog: Catalog, movieId: string): readonly ShowtimeDetails[] {
  const normalizedMovieId = movieId.trim();
  const movie = catalog.movies.find((candidate) => candidate.id === normalizedMovieId);
  if (movie === undefined) {
    throw new ApplicationError("MOVIE_NOT_FOUND", `Unknown movie id: ${normalizedMovieId}`);
  }

  return catalog.showtimes
    .filter((showtime) => showtime.movieId === movie.id)
    .map((showtime) => {
      const auditorium = catalog.auditoriums.find(
        (candidate) => candidate.id === showtime.auditoriumId
      );
      if (auditorium === undefined) {
        throw invalidCatalog(
          `Showtime '${showtime.id}' references unknown auditorium '${showtime.auditoriumId}'.`
        );
      }
      return { ...showtime, auditoriumName: auditorium.name };
    });
}

export class CinemaCatalogService {
  public constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly stateReader: StateReader
  ) {}

  public async listMovies(): Promise<readonly Movie[]> {
    return listMovies(await this.catalogRepository.load());
  }

  public async listShowtimes(movieId: string): Promise<readonly ShowtimeDetails[]> {
    return listShowtimes(await this.catalogRepository.load(), movieId);
  }

  public async getSeatAvailability(showtimeId: string): Promise<readonly SeatAvailability[]> {
    const [catalog, state] = await Promise.all([
      this.catalogRepository.load(),
      this.stateReader.load()
    ]);
    return projectSeatAvailability(catalog, state, showtimeId.trim());
  }
}
