import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MovieDetails from '../components/MovieDetails'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getMovie } from '../services/omdb'

export default function MovieInfo() {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const doApi = async () => {
      setIsLoading(true);
      setError("");
      setMovie(null);
      try {
        const data = await getMovie(id, controller.signal);
        if (!ignore) setMovie(data);
      } catch (err) {
        if (!ignore) setError(err.message || "Something went wrong.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    doApi();
    return () => { ignore = true; controller.abort(); };
  }, [id]);

  const onBack = () => {
    // "default" key = page opened directly, so there is no previous page of ours to go back to
    if (location.key === "default") {
      nav("/");
    } else {
      nav(-1);
    }
  }

  return (
    <div className='container text-center my-3'>
      {isLoading && <Loading />}
      {!isLoading && error && <ErrorMessage message={error} />}
      {!isLoading && movie && <MovieDetails movie={movie} />}
      {!isLoading && (
        <button type="button" className='btn btn-dark mt-3' onClick={onBack}>Back to list</button>
      )}
    </div>
  )
}
