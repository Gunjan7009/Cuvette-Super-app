import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchNews from "../data/fetchNews";
import { NewsCard, NewsSkeleton } from "../components/newsCard";
import { ProfileCard } from "../components/ProfileCard";
import { WeatherCard, WeatherSkeleton } from "../components/weatherCard";

import styles from "./Profile.module.css";

// API Keys
import { OPENWEATHERMAP_KEY } from "../secrets";
import { ProfileWeather } from "../components/ProfileWeather";

const DashboardPage = () => {
    // user variables
    const [user, setUser] = useState({
        name: "Not logged in",
        username: "guest",
        email: "guest@example.com",
        mobile: "",
        shareData: false,
        categories: ["Horror", "Thriller", "Action"],
    });

    // weather variables
    const [weather, setWeather] = useState(null);
    const [weatherDate, setWeatherDate] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    // news variables
    const [news, setNews] = useState({});
    const [newsLoading, setNewsLoading] = useState(true);

    // timer variables
    const [timerTime, setTimerTime] = useState({
        hours: 0,
        minutes: 1,
        seconds: 0,
    });
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const totalTime = useRef(0);
    const timerRef = useRef(null);

    /// navigation functions
    const navigate = useNavigate();

    const signOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const browseEntertainment = () => {
        navigate("/entertainment");
    };

    /// API Requests

    // Fetch news data from newsapi.org
    // const fetchNewsData = async () => {
    //   try {
    //     const response = await fetch(
    //       `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${NYTAPIKEY}`
    //     );
    //     const data = await response.json();
    //     console.log(NYTAPIKEY);
    //     setNews(data.results[0]);
    //   } catch (error) {
    //     console.error("Error fetching news data:", error);
    //   } finally {
    //     setNewsLoading(false);
    //   }
    // };

    useEffect(() => {
        setNewsLoading(true); // Set loading to true before fetching
        fetchNews().then((data) => {
            if (data.status === "ok") {
                const randomIndex = Math.floor(Math.random() * data.articles.length);
                setNews(data.articles[randomIndex]);
            }
            setNewsLoading(false); // Set loading to false once news data is fetched
        }).catch(error => {
            console.error("Error fetching news:", error);
            setNewsLoading(false); // Even on error, stop the loading state
        });
    }, []);

    // Helper function to get geo location of user
    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    // Fetch weather data from openweathermap.org
    const fetchWeatherData = async () => {
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHERMAP_KEY}`
            );

            const data = await response.json();
            setWeather(data);
            setWeatherDate(new Date(data.dt * 1000));
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setWeatherLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        saveCategories();
        navigate("/");
    };

    useEffect(() => {
        fetchWeatherData();
        // fetchNewsData();
        const timer = setInterval(() => new Date(), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        totalTime.current =
            timerTime.hours * 3600 + timerTime.minutes * 60 + timerTime.seconds;
    }, [timerTime]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setElapsedTime((prevElapsed) => {
                    if (prevElapsed >= totalTime.current) {
                        clearInterval(timerRef.current);
                        setIsRunning(false);
                        return totalTime.current;
                    }
                    return prevElapsed + 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user !== null) {
            setUser(JSON.parse(user));
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>
                <ProfileCard user={user} signOut={signOut} />

                {weatherLoading ? (
                    <WeatherSkeleton />
                ) : weather ? (
                    <ProfileWeather weather={weather} weatherDate={weatherDate} />
                ) : (
                    <p>Error fetching weather data</p>
                )}

                {newsLoading ? (
                    <NewsSkeleton />
                ) : news ? (
                    <NewsCard news={news} />
                ) : (
                    <p>Error fetching news data</p>
                )}

            </div>
            <div className={styles.footer} onClick={browseEntertainment}>
                <button className={styles.browseButton}>Next</button>
            </div>
        </div>
    );
};

export default DashboardPage;
