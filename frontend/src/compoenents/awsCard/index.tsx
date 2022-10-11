import "./awsCard.css";

import { Card, CardContent } from "@mui/material";

function AwsCard() {
  return (
    <Card className="aws">
      <CardContent className="cardContent">
        <h1 className="title">AWS Monitor</h1>
        <h3 className="content">
          Cloud Watch - Logs/DynamoDB/Lambda/APIGateway/...
        </h3>
        <h3 className="content">Billing</h3>
      </CardContent>
    </Card>
  );
}

export default AwsCard;
