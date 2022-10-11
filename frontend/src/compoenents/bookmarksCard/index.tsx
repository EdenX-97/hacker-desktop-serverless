import "./bookmarksCard.css";

import { Card, CardContent } from "@mui/material";

function BookmarksCard() {
  return (
    <Card className="bookmarks">
      <CardContent className="cardContent">
        <h2 className="title">Book marks - quick start</h2>
      </CardContent>
    </Card>
  );
}

export default BookmarksCard;
