import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import "./news.css";
import Tooltip from "@mui/material/Tooltip";

interface propsType {
  title: string;
  link: string;
}

function News(props: propsType) {
  return (
    <Tooltip title={props.title} placement="right">
      <Typography className="typography" variant="body2">
        <ArrowForwardIosIcon className="icon" />
        <Link
          href={props.link}
          target="_blank"
          underline="hover"
          color="text.secondary"
          className="link"
        >
          {props.title}
        </Link>
      </Typography>
    </Tooltip>
  );
}

export default News;
