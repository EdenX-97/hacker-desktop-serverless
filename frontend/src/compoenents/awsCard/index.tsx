import "./awsCard.css";

import { Card, CardContent } from "@mui/material";
import Divider from "@mui/material/Divider";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCost, updateBilling } from "../../store/cost";
import CachedIcon from "@mui/icons-material/Cached";

function AwsCard() {
  // Update the billing
  const billing = useAppSelector((state) => state.cost.billing);
  const billingRef = useRef(billing);
  const dispatch = useAppDispatch();

  // Update billing from api
  useEffect(() => {
    dispatch(fetchCost());
  }, [dispatch, billingRef]);

  const freshBilling = () => {
    dispatch(updateBilling());
  };

  return (
    <Card className="aws">
      <CardContent className="cardContent">
        <div className="billing">
          <IconButton className="button">
            <AttachMoneyIcon className="moneyIcon" />
          </IconButton>
          <h3 className="content"> {"AWS billing this month: " + billing} </h3>
          <IconButton onClick={freshBilling} className="button">
            <CachedIcon className="freshIcon" />
          </IconButton>
        </div>

        <Divider />

        <h3>Cloud Watch - Logs/DynamoDB/Lambda/APIGateway/...</h3>
      </CardContent>
    </Card>
  );
}

export default AwsCard;
