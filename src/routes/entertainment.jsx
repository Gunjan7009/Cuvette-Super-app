// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { userPlaceholder } from "../data/data";

// import "../index.css";
// import styles from "./entertainment.module.css";

// import { MOVIEDB_KEY } from "../secrets";

// /// Category Skeleton shown while loading
// const CategorySkeleton = () => (
//   <section className={styles.category}>
//     <h3 className={`${styles.skeletonText} ${styles.skeletonShimmer}`}></h3>
//     <div className={styles.movieGrid}>
//       {[...Array(5)].map((_, index) => (
//         <div key={index} className={`${styles.movieCard} ${styles.skeleton}`}>
//           <div
//             className={`${styles.movieImage} ${styles.skeletonShimmer}`}
//           ></div>
//         </div>
//       ))}
//     </div>
//   </section>
// );

// /// Entertainment Page
// const EntertainmentPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [filteredMovies, setFilteredMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const carouselRefs = useRef({});
//   const navigate = useNavigate();
//   // navigation functions
//   const goToDashboard = () => {
//     navigate("/");
//   };

//   // Fetch movies from themoviedb.org
//   const fetchMovies = async () => {
//     try {
//       const response = await fetch(

//        `http://www.omdbapi.com/?s=blade+runner&apikey=${MOVIEDB_KEY}`

//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       const fetchedMovies = data.Search || [];
//       setMovies(fetchedMovies);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//       // const data = await response.json();


//   //     const transformedMovies = {
//   //       Action: data.results.filter((movie) => movie.genre_ids.includes(28)),
//   //       Thriller: data.results.filter((movie) => movie.genre_ids.includes(53)),
//   //       Horror: data.results.filter((movie) => movie.genre_ids.includes(27)),
//   //     };

//   //     setMovies(transformedMovies);
//   //   } catch (error) {
//   //     setError(error.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const filterMoviesByCategory = (movies, selectedCategories) => {
//     return movies.filter((movie) => {
//       // Example: Check movie's genre here against selected categories
//       // This is a placeholder logic, adjust based on the movie's genre data
//       const genres = movie.Genre.split(", ");
//       return genres.some((genre) => selectedCategories.includes(genre));
//     });
//   };
//   useEffect(() => {
//     fetchMovies();
  
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user === null || user.categories.length === 0) {
//       navigate("/categories");
//     } else {
//       setFilteredMovies(filterMoviesByCategory(movies, user.categories));
//     }
//   }, [movies, navigate]);

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <h1
//           className="appName"
//           alt="Home"
//           onClick={goToDashboard}
//           style={{
//             cursor: "pointer",
//           }}
//         >
//           Super app
//         </h1>
//         <div className={styles.userAvatar}>
//           <img
//             className={styles.avatarImage}
//             src={userPlaceholder}
//             onClick={goToDashboard}
//             alt="User avatar"
//           />
//         </div>
//       </header>
//       <main className={styles.main}>
//         <h2 className={styles.title}>Entertainment according to your choice</h2>

//         {loading ? (
//           <>
//             <p>Loading...</p>
//           </>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : (
//           <section className={styles.category}>
//             <h3>Movies</h3>
//             <div className={styles.movieGrid}>
//               {filteredMovies.map((movie, index) => (
//                 <div key={`${movie.imdbID}-${index}`} className={styles.movieCard}>
//                   <img
//                     className={styles.movieImage}
//                     src={movie.Poster}
//                     alt={movie.Title}
//                   />
//                   <p>{movie.Title} ({movie.Year})</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default EntertainmentPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userPlaceholder } from "../data/data";
import categories from "../data/categories";
import "../index.css";
import styles from "./entertainment.module.css";
import { MOVIEDB_KEY } from "../secrets";


const EntertainmentPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch movies list from OMDB API (initial search)
  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=movie&apikey=${MOVIEDB_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies from OMDB API.");
      }

      const data = await response.json();
      const fetchedMovies = data.Search || [];
      
      // For each movie in the list, fetch full movie details by imdbID
      const detailedMovies = await Promise.all(
        fetchedMovies.map(async (movie) => {
          const detailsResponse = await fetch(
            `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${MOVIEDB_KEY}`
          );
          const detailsData = await detailsResponse.json();
          return detailsData;
        })
      );
      
      setMovies(detailedMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies based on the actual genres returned by OMDB API
  const filterMoviesByCategory = (categoryName, movies) => {
    // Match category with actual genres from OMDB data
    return movies.filter((movie) => {
      const movieGenres = movie.Genre?.split(", ") || [];
      return movieGenres.some((genre) =>
        genre.toLowerCase().includes(categoryName.toLowerCase())
      );
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.categories.length === 0) {
      navigate("/categories");
      return;
    }

    fetchMovies(); // Fetch movies when the component mounts
  }, [navigate]);


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1
          className="appName"
          alt="Home"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Super app
        </h1>
        <div className={styles.userAvatar}>
          <img
            className={styles.avatarImage}
            src={userPlaceholder}
            alt="User avatar"
            onClick={() => navigate("/")}
          />
        </div>
      </header>
      <main className={styles.main}>
        <h2 className={styles.title}>Entertainment according to your choice</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
         // Render categories dynamically based on user's selected categories
         categories.map((category) => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user.categories.includes(category.name)) return null;

          const filteredMovies = filterMoviesByCategory(category.name, movies);
          if (filteredMovies.length === 0) return null;

          return (
            <section key={category.name} className={styles.categorySection}>
              <h3 style={{ color: category.color }}>{category.name}</h3>
              <div className={styles.movieGrid}>
                {filteredMovies.map((movie, index) => (
                  <div key={`${movie.imdbID}-${index}`} className={styles.movieCard}>
                    <img
                      className={styles.movieImage}
                      src={movie.Poster}
                      alt={movie.Title}
                    />
                    <p>{movie.Title} ({movie.Year})</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
      </main>
    </div>
  );
};

export default EntertainmentPage;
