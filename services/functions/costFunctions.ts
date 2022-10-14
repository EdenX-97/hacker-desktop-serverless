/*
 * @Description: Cost functions
 * @Author: Mo Xu
 * @Date: 2022-10-14 02:08:06
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-15 01:04:47
 */
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS, { CostExplorer } from "aws-sdk";
import { GetCostAndUsageRequest } from "aws-sdk/clients/costexplorer";
import status from "./../enums/status";
import dynamodb from "./../utils/dynamodb";
import { result } from "./../utils/result";

// Set cost explorer
AWS.config.update({ region: "us-east-1" });
const costExplorer: CostExplorer = new AWS.CostExplorer();

// Get table name from env
const tableName = process.env.TABLE_NAME_DICTIONARY;

/**
 * @description: Get billing from cost explorer and save to dynamoDB
 */
export const updateBilling: APIGatewayProxyHandlerV2 = async () => {
  // Set time to get only this month's billing
  const nowDate: Date = new Date();
  const year: number = nowDate.getFullYear();
  const month: number = nowDate.getMonth();

  const start: string = new Date(year, month, 1).toISOString().split("T")[0];
  const end: string = new Date(year, month + 1, 1).toISOString().split("T")[0];

  // Get billing from cost explorer
  const params: GetCostAndUsageRequest = {
    TimePeriod: {
      Start: start,
      End: end,
    },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
  };

  let billing: string | undefined = undefined;
  try {
    const response = await costExplorer.getCostAndUsage(params).promise();

    billing = response.ResultsByTime?.at(0)?.Total?.UnblendedCost?.Amount;
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot get billing: " + e);
  }

  if (billing) {
    const billingContent = parseFloat(billing).toFixed(2) + " USD";

    // Define saved params
    const savedParams = {
      TableName: tableName,
      Item: {
        key: "billing",
        value: billingContent,
      },
    };

    // Store billing content to dynamoDB
    try {
      await dynamodb.put(savedParams);
    } catch (e: unknown) {
      return result(status.FAIL, "Cannot save to dynamodb: " + e);
    }

    return result(status.SUCCESS, billingContent);
  }

  return result(status.FAIL, "Cannot get billing");
};

/**
 * @description: Get the billing
 */
export const getBilling: APIGatewayProxyHandlerV2 = async () => {
  let res = undefined;
  try {
    res = await dynamodb.get({
      TableName: tableName,
      Key: {
        key: "billing",
      },
    });
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot get billing: " + e);
  }

  if (res && res?.Item) {
    return result(status.SUCCESS, res.Item.value);
  }

  return result(status.FAIL, "Cannot get billing");
};
