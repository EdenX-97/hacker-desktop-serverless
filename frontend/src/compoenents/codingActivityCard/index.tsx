import "./codingActivityCard.css";

import { Card, CardContent } from "@mui/material";
import configs from "./../../configs.json";

function CodingActivityCard() {
  return (
    <Card className="codingActivity">
      <CardContent className="cardContent">
        <h3 className="content">Coding Activity over Last 7 Days</h3>
        <img className="img" src={configs.wakatime} alt="" />
      </CardContent>
    </Card>
  );
}

export default CodingActivityCard;
