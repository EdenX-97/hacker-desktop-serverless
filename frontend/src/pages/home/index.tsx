import "./Home.css";
import NewsCard from "../../compoenents/newsCard";
import Grid from "@mui/material/Unstable_Grid2";
import PodcastsCard from "../../compoenents/podcastsCard";
import SearchCard from "../../compoenents/searchCard";
import AwsCard from "../../compoenents/awsCard";
import CodingActivityCard from "../../compoenents/codingActivityCard";
import TimeCard from "../../compoenents/titleAndtimeCard";

function Home() {
  return (
    <Grid className="Home" container spacing={4}>
      <Grid display="flex" justifyContent="center" xs={5}>
        <NewsCard />
      </Grid>
      <Grid display="flex" justifyContent="center" xs={4}>
        <SearchCard />
      </Grid>
      <Grid display="flex" justifyContent="center" xs={3}>
        <TimeCard />
      </Grid>
      <Grid display="flex" justifyContent="center" xs={5}>
        <PodcastsCard />
      </Grid>
      <Grid display="flex" justifyContent="center" xs={4}>
        <AwsCard />
      </Grid>
      <Grid display="flex" justifyContent="center" xs={3}>
        <CodingActivityCard />
      </Grid>
    </Grid>
  );
}

export default Home;
