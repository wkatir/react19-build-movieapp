import heroBanner from '/hero.png'
import { useState, useEffect, useSyncExternalStore } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3/'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
 
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
  setDebouncedSearchTerm(searchTerm);
}, 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    
    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}discover/movie`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      if(data.response === 'False'){
        setErrorMessage('Failed to fetch movies')
        setMovieList([]);
        return;
      }

      console.log(data);
      setMovieList(data.results || []);

    }catch(e){
      console.log(`Error fetching movies: ${e}`)
      setErrorMessage("Error fetching movies. Please try again later.");
    }finally{
      setIsLoading(false);
    }

  }

  useEffect(() =>
  {
      fetchMovies(searchTerm);
  },[debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern">

      </div>
      <div className="wrapper">
        <header>
          <img src={ heroBanner } alt="hero-banner" />
          <h1>Find the best <span className="text-gradient">streaming</span> movies for you</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
        </header>
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
            {
              isLoading ? (
                <Spinner></Spinner>
              ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                <ul>
                  {movieList.map((movie) => ( 
                    <MovieCard movie={movie} key={movie.id}></MovieCard>
                  ) )}
                </ul>
              )
            }
        </section>
      </div>
      
    </main>
  )
}

export default App
