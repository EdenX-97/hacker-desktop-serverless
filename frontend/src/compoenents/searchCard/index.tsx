import "./searchCard.css";

import GoogleIcon from "@mui/icons-material/Google";
import SearchIcon from "@mui/icons-material/Search";
import { Card, CardContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

function SearchCard() {
  const [inputContent, setInputContent] = useState("");

  const search = () => {
    window.open("https://www.google.com/search?q=" + inputContent);
  };

  const keyPressSearch = (key: string) => {
    if (key === "Enter") {
      window.open("https://www.google.com/search?q=" + inputContent);
    }
  };

  return (
    <Card className="search">
      <CardContent className="cardContent">
        <div className="searchBar">
          <IconButton className="button">
            <GoogleIcon className="googleIcon" />
          </IconButton>
          <InputBase
            className="inputBase"
            sx={{ ml: 1, flex: 1 }}
            placeholder="Google Search"
            value={inputContent}
            onChange={(event) => setInputContent(event.target.value)}
            onKeyPress={(event) => keyPressSearch(event.key)}
          />
          <IconButton className="button" type="button" onClick={search}>
            <SearchIcon className="searchIcon" />
          </IconButton>
        </div>

        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText className="itemText" primary="Bookmark 1" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText className="itemText" primary="Bookmark 2" />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default SearchCard;
