import "./podcastsCard.css";

import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Card, CardContent, SelectChangeEvent } from "@mui/material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPodcasts } from "../../store/podcasts";

function PodcastsCard() {
  // Set podcast data
  const podcastsList: object = useAppSelector(
    (state) => state.podcasts.podcastsList
  );
  const podcastsListRef = useRef(podcastsList);
  const dispatch = useAppDispatch();

  // Update podcasts from api
  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch, podcastsListRef]);

  // Handle select
  const [select, setSelect] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value);
  };

  const theme = useTheme();

  // Play audio function
  const [podcastAudio, setPodcastAudio] = React.useState(new Audio(""));
  const [isPlaying, setIsPlaying] = React.useState(false);

  const setAudio = (index: number): string => {
    const podcastName: string = Object.keys(podcastsList)[index];
    return podcastName;
  };

  // Update podcast audio
  useEffect(() => {
    if (isPlaying && podcastAudio) {
      podcastAudio.pause();
      setIsPlaying(false);
    }
    const podcast: any = Object.values(podcastsList)[parseInt(select)];
    if (podcast) {
      setPodcastAudio(new Audio(podcast.link));
    }
  }, [select, podcastsList]);

  const playAudio = () => {
    if (isPlaying) {
      podcastAudio.pause();
    } else {
      podcastAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playOrPause = () => {
    if (isPlaying) {
      return <PauseIcon className="icon" />;
    } else {
      return <PlayArrowIcon className="icon" />;
    }
  };

  const nextAudio = () => {
    if (select !== Object.keys(podcastsList).length.toString()) {
      setSelect((parseInt(select) + 1).toString());
    }
  };

  const previousAudio = () => {
    if (select !== "0") {
      setSelect((parseInt(select) - 1).toString());
    }
  };

  const showPodcastCard = (
    index: number,
    data: { title: string; link: string; image: string }
  ) => {
    if (index.toString() === select) {
      return (
        <Card
          key={index.toString()}
          className="audioPlayCard"
          sx={{ display: "flex" }}
        >
          <CardMedia className="img" component="img" image={data.image} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" className="title">
                {data.title}
              </Typography>
              {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                            {data.title}
                        </Typography> */}
            </CardContent>

            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="previous" onClick={previousAudio}>
                {theme.direction === "rtl" ? (
                  <SkipNextIcon />
                ) : (
                  <SkipPreviousIcon />
                )}
              </IconButton>
              <IconButton aria-label="play/pause" onClick={playAudio}>
                {playOrPause()}
              </IconButton>
              <IconButton aria-label="next" onClick={nextAudio}>
                {theme.direction === "rtl" ? (
                  <SkipPreviousIcon />
                ) : (
                  <SkipNextIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        </Card>
      );
    }
  };

  return (
    <Card className="podcasts">
      <CardContent className="cardContent">
        <FormControl variant="standard" className="formControl">
          {/*<InputLabel id="demo-simple-select-standard-label">Age</InputLabel>*/}
          <Select value={select} onChange={handleChange} className="selector">
            {Object.keys(podcastsList).map((title: string, index) => (
              <MenuItem key={index.toString()} value={index.toString()}>
                {setAudio(index)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>

      {Object.values(podcastsList).map(
        (data: { title: string; link: string; image: string }, index: number) =>
          showPodcastCard(index, data)
      )}
    </Card>
  );
}

export default PodcastsCard;
