import axios from "axios";

export const BASE_URL = "https://www.omdbapi.com/";

export const API_KEYS = [
  process.env.REACT_APP_OMDB_KEY_PRIMARY || "5a292f28",
  process.env.REACT_APP_OMDB_KEY_FALLBACK || "90781f94",
].filter(Boolean);

export const DEFAULT_TERM = "black";

// OMDb errors about the key itself: worth retrying with the other key
const KEY_ERRORS = ["Invalid API key!", "Request limit reached!", "No API key provided."];

export class OmdbError extends Error {
  // kind: validation | not_found | too_many | api | network | key | canceled
  constructor(message, kind) {
    super(message);
    this.name = "OmdbError";
    this.kind = kind;
  }
}

const NETWORK_MSG = "Cannot reach the movie server. Check your connection and try again.";
const KEY_MSG = "The movie service is unavailable right now. Please try again later.";

function isCanceled(err) {
  return !!err && (err.code === "ERR_CANCELED" || err.name === "CanceledError" || err.name === "AbortError");
}

// Tries the primary key first, then the backup key on network errors,
// 401, rate limit or 5xx. Real API errors (movie not found...) are not retried.
async function request(params, signal) {
  let lastError = new OmdbError(NETWORK_MSG, "network");
  for (const apikey of API_KEYS) {
    try {
      const { data } = await axios.get(BASE_URL, {
        params: { ...params, apikey },
        timeout: 10000,
        signal,
      });
      // OMDb sometimes sends invalid JSON on error (unescaped quotes), so axios leaves a string
      if (typeof data === "string" && data.includes('"Response":"False"')) {
        const m = data.match(/"Error":"(.*)"\s*}\s*$/);
        throw new OmdbError(m ? m[1] : "Movie not found!", "api");
      }
      if (!data || typeof data !== "object") {
        lastError = new OmdbError(NETWORK_MSG, "network");
        continue;
      }
      if (data.Response === "False") {
        if (KEY_ERRORS.includes(data.Error)) {
          lastError = new OmdbError(KEY_MSG, "key");
          continue;
        }
        throw new OmdbError(data.Error || "Unknown error.", "api");
      }
      return data;
    } catch (err) {
      if (err instanceof OmdbError && err.kind === "api") throw err;
      if (isCanceled(err)) throw new OmdbError("Request canceled.", "canceled");
      if (err instanceof OmdbError) continue;
      const status = err.response && err.response.status;
      if (!err.response) {
        lastError = new OmdbError(NETWORK_MSG, "network");
      } else if (status === 401) {
        lastError = new OmdbError(KEY_MSG, "key");
      } else if (status >= 500) {
        lastError = new OmdbError(`The movie server is not responding (error ${status}).`, "network");
      } else {
        throw new OmdbError(`The movie server returned an error (${status}).`, "network");
      }
    }
  }
  throw lastError;
}

export async function searchMovies(term, page = 1, signal) {
  const s = (term || "").trim();
  if (!s) throw new OmdbError("Please type a movie title to search.", "validation");
  try {
    const data = await request({ s, page }, signal);
    // the same imdbID can come back twice, which breaks React keys
    const seen = new Set();
    const movies = (data.Search || []).filter((m) => {
      if (seen.has(m.imdbID)) return false;
      seen.add(m.imdbID);
      return true;
    });
    return { movies, total: Number(data.totalResults) || 0 };
  } catch (err) {
    if (err instanceof OmdbError && err.kind === "api") {
      if (err.message === "Movie not found!") {
        throw new OmdbError(`No movies found for "${s}". Try another title.`, "not_found");
      }
      if (err.message === "Too many results.") {
        throw new OmdbError(`Too many results for "${s}". Please type a more specific title.`, "too_many");
      }
    }
    throw err;
  }
}

export async function getMovie(id, signal) {
  try {
    return await request({ i: id, plot: "full" }, signal);
  } catch (err) {
    if (err instanceof OmdbError && err.kind === "api") {
      throw new OmdbError("This movie could not be found.", "not_found");
    }
    throw err;
  }
}

// OMDb uses "N/A" for unknown values
export function valueOrNull(value) {
  return value && value !== "N/A" ? value : null;
}
