import { APIGatewayProxyEventV2 } from "aws-lambda";
/*
 * @Description: Weather functions
 * @Author: Mo Xu
 * @Date: 2022-10-15 01:04:19
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-15 01:45:52
 */
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import dynamodb from "./../utils/dynamodb";
import { get } from "./../utils/request";
import configs from "./../../configs.json";
import { result, resultType } from "./../utils/result";
import status from "./../enums/status";

// Get table name from env
const tableName = process.env.TABLE_NAME_DICTIONARY;

/**
 * @description: Update the weather to dynamoDB according to location
 */
export const updateWeather: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const lat: string | undefined = event.queryStringParameters?.lat;
  const long: string | undefined = event.queryStringParameters?.lon;

  let requestUrl: string = "";
  if (lat && long) {
    requestUrl = configs.weatherApi
      .replace("{lat}", lat)
      .replace("{lon}", long);
  }

  let res;
  try {
    res = await get(requestUrl);
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot read weather from api");
  }

  const weatherJson = res?.data;

  const temp = weatherJson.current.temp;
  const weather = weatherJson.current.weather[0].description;

  // Define saved params
  const savedParamsTemp = {
    TableName: tableName,
    Item: {
      key: "temp",
      value: temp,
    },
  };

  const savedParamsWeather = {
    TableName: tableName,
    Item: {
      key: "weather",
      value: weather,
    },
  };

  // Save params to dynamoDB
  try {
    await dynamodb.put(savedParamsTemp);
    await dynamodb.put(savedParamsWeather);
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot save to dynamodb: " + e);
  }

  return result(status.SUCCESS, "Update weather success");
};

/**
 * @description: Get the weather
 */
export const getWeather: APIGatewayProxyHandlerV2 = async () => {
  let res = undefined;
  try {
    res = await dynamodb.get({
      TableName: tableName,
      Key: {
        key: "weather",
      },
    });
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot get weather: " + e);
  }

  if (res && res?.Item) {
    return result(status.SUCCESS, res.Item.value);
  }

  return result(status.FAIL, "Cannot get weather");
};

/**
 * @description: Get the temperature
 */
export const getTemp: APIGatewayProxyHandlerV2 = async () => {
  let res = undefined;
  try {
    res = await dynamodb.get({
      TableName: tableName,
      Key: {
        key: "temp",
      },
    });
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot get temp: " + e);
  }

  if (res && res?.Item) {
    return result(status.SUCCESS, res.Item.value);
  }

  return result(status.FAIL, "Cannot get temp");
};
