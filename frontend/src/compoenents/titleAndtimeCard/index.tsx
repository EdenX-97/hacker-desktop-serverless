import "./titleAndTimeCard.css";

import { Card, CardContent } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTemp, fetchWeather, updateWeather } from "../../store/weather";

function TimeAndSearchCard() {
  const locale = "en";
  const [today, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Update time every 5 seconds
      setDate(new Date());
    }, 5 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}`;

  const year = today.getFullYear();

  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });

  // Update the weather and temp
  const weather = useAppSelector((state) => state.weather.weather);
  const temp = useAppSelector((state) => state.weather.temp);
  const weatherRef = useRef(weather);
  const tempRef = useRef(temp);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchWeather());
    dispatch(fetchTemp());
  }, [dispatch, weatherRef, tempRef]);

  return (
    <div className="titleAndTime">
      <Card className="titleContent">
        <CardContent className="cardContent">
          <h1 className="title">Eden's Hacker Desktop</h1>
        </CardContent>
      </Card>

      <Card className="time">
        <CardContent className="cardContent">
          <h1 className="title">{time}</h1>
          <h4 className="content">{date}</h4>
          <h4 className="content">{year}</h4>
          <h4 className="content">{weather + " - " + temp + "°C"}</h4>
        </CardContent>
      </Card>
    </div>
  );
}

export default TimeAndSearchCard;
