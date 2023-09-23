import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import AddMovieForm from './AddMovieForm';

const App = ()=> {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchMovies = async() => {
      const {data} = await axios.get('/api/movies/');
      setMovies(data);
    }
    fetchMovies();
  }, []);

  //both work :D
  const increaseRating = async(movie) => {
    try {
      setError('')
      const newRating = movie.stars + 1
      const {data} = await axios.put(`/api/movies/${movie.id}` , {title: movie.title, stars: newRating})
      
      const newMovies = movies.map((movieMap) => {
        if(movieMap.id === movie.id) {
          return data 
        } else {
          return movieMap
        };
      });
      setMovies(newMovies)
    } catch (error) {
      setError(error.response.data)
    }
  };

  const decreaseRating = async(movie) => {
    try {
      setError('')
      const newRating = movie.stars - 1
      const {data} = await axios.put(`/api/movies/${movie.id}` , {title: movie.title, stars: newRating})
  
      const newMovies = movies.map((movieMap) => {
        if(movieMap.id === movie.id) {
          return data 
        } else {
          return movieMap
        }
  
      });
      setMovies(newMovies)
    } catch (error) {
      setError(error.response.data)
    }
  };

  const deleteMovie = async (movie) => {
    await axios.delete(`/api/movies/${movie.id}`)
    const updatedMovieList = movies.filter((movieFilter)=> {
      return (movieFilter.id !== movie.id)
    });
    setMovies(updatedMovieList)
  };

  return (
    <div>
      <h1>Carlie's Favorite Movies ({movies.length})</h1>
      <p>{error? error: ""}</p>
      <AddMovieForm movies={movies} setMovies={setMovies}/>
        <ul>
          {
            movies.map ((movie) => {
              return (
                <li key={movie.id}>
                  <h2>{movie.title}</h2>
                  <h4>
                    <span>
                      Rating: {movie.stars} stars
                    <button onClick={() => {increaseRating(movie)}}>+</button>
                    <button onClick={() => {decreaseRating(movie)}}>-</button>
                    </span>
                  </h4>
                  <button onClick={() => {deleteMovie(movie)}}>Delete</button>
                </li>
              );
            })
          }
        </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
