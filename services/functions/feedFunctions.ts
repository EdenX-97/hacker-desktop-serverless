/*
 * @Description: RSS feed functions
 * @Author: Mo Xu
 * @Date: 2022-10-06 22:11:58
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-11-15 17:19:10
 */
import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from "aws-lambda";
import dynamodb from "./../utils/dynamodb";
import { result, resultType } from "./../utils/result";
import status from "./../enums/status";
import feedTypes from "./../enums/feedTypes";
import { readFeed } from "../utils/feed";
import { checkUrl } from "./../utils/regex";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import configs from "./../../configs.json";

// Get table name from env
const tableName = process.env.TABLE_NAME_FEEDS;

/**
 * @description: Subscribe one RSS feed
 * @param {string} url URL of RSS feed
 */
export async function subscribe(url: string): Promise<resultType> {
  if (!url || !checkUrl(url)) {
    return result(status.NOTFOUND, "Url not input or incorrect");
  }

  // Set feed attributes
  const feed = await readFeed(url);
  const feedTitle = feed.title;
  if (!feedTitle) {
    return result(status.NOTFOUND, "Feed not correct");
  }

  let feedName: string = "";
  let feedType: string = "";

  Object.keys(configs).forEach((key) => {
    const newsOrPodcast = configs[key];
    const resultKey = Object.keys(newsOrPodcast)
      .filter((filterKey: string) => {
        const title: string = newsOrPodcast[filterKey].title;
        return feedTitle.includes(title);
      })
      .at(0);
    if (resultKey) {
      feedName = newsOrPodcast[resultKey].name;
      if (key == "news") {
        feedType = feedTypes.NEWS;
      } else if (key == "podcasts") {
        feedType = feedTypes.PODCAST;
      }
    }
  });

  if (feedType == "" || feedName == "") {
    return result(status.NOTFOUND, "Feed title not found");
  }

  const nowTime: number = Date.parse(new Date().toString());
  const feedLink = url;

  // Check if feed exist
  try {
    const results = await dynamodb.get({
      TableName: tableName,
      Key: {
        name: feedName,
        type: feedType,
      },
    });

    // If the feed exist, cannot subscribe again
    if (results.Item) {
      return result(status.FAIL, "Feed already exist");
    }
  } catch (e: unknown) {
    return result(status.FAIL, "Check if feed exsist fail: " + e);
  }

  // Define saved params
  const savedParams = {
    TableName: tableName,
    Item: {
      name: feedName,
      type: feedType,
      title: feedTitle,
      link: feedLink,
      lastUpdateDate: nowTime,
    },
  };

  // Save params to dynamoDB
  try {
    await dynamodb.put(savedParams);
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot save to dynamodb: " + e);
  }

  return result(status.SUCCESS, "Subscribe success");
}

/**
 * @description: Lambda function to subscribe rss feeds
 * @return {*}
 */
export const subscribeAll: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  // Iterate to get all links and subscribe it
  for (let news in configs.news) {
    const result = await subscribe(configs.news[news].link);
    if (result.statusCode != status.SUCCESS) {
      if (result.body == "Feed already exist") {
        continue;
      }
      return result;
    }
  }
  for (let podcast in configs.podcasts) {
    const result = await subscribe(configs.podcasts[podcast].link);
    if (result.statusCode != status.SUCCESS) {
      if (result.body == "Feed already exist") {
        continue;
      }
      return result;
    }
  }

  return result(status.SUCCESS, "Subscribe all feeds success");
};

/**
 * @description: Get feed infos from dynamodb
 * @return {*} The feed infomations
 */
export async function getFeedInfos(
  name: string,
  type: string
): Promise<DocumentClient.AttributeMap | undefined> {
  // Get feed infos from dynamodb
  const results = await dynamodb.get({
    TableName: tableName,
    Key: {
      name: name,
      type: type,
    },
  });

  return results.Item;
}

/**
 * @description: Get feed from url
 * @param {DocumentClient.AttributeMap | undefined} feedInfos
 * @return {*} The feed infomations
 */
export async function getFeed(
  feedInfos: DocumentClient.AttributeMap | undefined
): Promise<{ [key: string]: any }> {
  // Get feed from url
  const feed = await readFeed(feedInfos?.link);

  return feed;
}

/**
 * @description: Update the feed to dynamodb
 * @param {string} feedName
 * @param {string[]} newsIdList
 */
export async function updateNewsFeed(
  feedName: string,
  newsIdList: string[]
): Promise<void> {
  const savedParams = {
    TableName: tableName,
    Key: {
      name: feedName,
      type: feedTypes.NEWS,
    },
    UpdateExpression: "SET newsIds = :newsIds",
    ExpressionAttributeValues: {
      ":newsIds": newsIdList,
    },
  };

  await dynamodb.update(savedParams);
}

/**
 * @description: Update the feed to dynamodb
 * @param {string} podcastName
 * @param {string} podcastId
 */
export async function updatePodcastFeed(
  podcastName: string,
  podcastId: string
): Promise<void> {
  const savedParams = {
    TableName: tableName,
    Key: {
      name: podcastName,
      type: feedTypes.PODCAST,
    },
    UpdateExpression: "SET podcastId = :podcastId",
    ExpressionAttributeValues: {
      ":podcastId": podcastId,
    },
  };

  await dynamodb.update(savedParams);
}
