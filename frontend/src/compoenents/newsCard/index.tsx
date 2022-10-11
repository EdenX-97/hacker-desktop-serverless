import * as React from "react";
import { useEffect, useRef, useState, SyntheticEvent } from "react";
import "./newsCard.css";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { fetchNewsList } from "../../store/news";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import News from "./news";

function NewsCard() {
  // Set news list and dispatch function
  const newsList = useAppSelector((state) => state.news.newsList);
  const newsListRef = useRef(newsList);
  const dispatch = useAppDispatch();

  // Update news from api
  useEffect(() => {
    dispatch(fetchNewsList());
  }, [dispatch, newsListRef]);

  // State and function to handle tabs switch
  const [value, setValue] = useState("0");
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Card className="news">
      <CardContent className="cardContent">
        <TabContext value={value}>
          <TabList onChange={handleChange} variant="scrollable">
            {Object.keys(newsList).map((providerName: string, index) => (
              <Tab
                key={index.toString()}
                label={providerName}
                value={index.toString()}
              />
            ))}
          </TabList>

          {Object.values(newsList).map((list: any[], index) => (
            <TabPanel
              key={index.toString()}
              className="tabPanel"
              value={index.toString()}
            >
              {list.map((data: { title: string; link: string }, index) => (
                <News
                  key={index.toString()}
                  title={data.title}
                  link={data.link}
                />
              ))}
            </TabPanel>
          ))}
        </TabContext>
      </CardContent>
    </Card>
  );
}

export default NewsCard;
