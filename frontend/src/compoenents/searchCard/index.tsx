import "./searchCard.css";

import { Card, CardContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

function TimeAndSearchCard() {
  return (
    <Card className="search">
      <CardContent className="cardContent">
        <TextField
          variant="outlined"
          fullWidth
          label="Search (cannot use yet)"
          className="searchBar"
        />

        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                className="itemText"
                primary="Search item example"
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                className="itemText"
                primary="Search item example"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default TimeAndSearchCard;
