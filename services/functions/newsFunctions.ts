/*
 * @Description: News functinos
 * @Author: Mo Xu
 * @Date: 2022-10-07 16:17:46
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-09 23:08:23
 */
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import configs from "./../../configs.json";
import dynamodb from "./../utils/dynamodb";
import { result, resultType } from "./../utils/result";
import status from "./../enums/status";
import feedTypes from "./../enums/feedTypes";
import { parse } from "node-html-parser";
import * as uuid from "uuid";
import {
  getFeedInfos,
  getFeed,
  updateNewsFeed,
} from "../functions/feedFunctions";

// Get table name from env
const newsTableName = process.env.TABLE_NAME_NEWS;

/**
 * @description: Get news
 * @param {string} newsId The id of news
 */
async function getNews(newsId: string) {
  const news = await dynamodb.get({
    TableName: newsTableName,
    Key: {
      newsId: newsId,
    },
  });
  return news?.Item;
}

/**
 * @description: Create news to dynamodb
 * @param {string} newsId
 * @param {string} newsTitle
 * @param {string} newsLink
 * @param {string[]} newsIdList
 */
function createNews(
  newsId: string,
  newsTitle: string,
  newsLink: string,
  newsIdList: string[]
): string[] {
  // Do not save if any param is undefined
  if (!newsId || !newsTitle || !newsLink) {
    return newsIdList;
  }

  // Define saved params
  const savedParams = {
    TableName: newsTableName,
    Item: {
      newsId: newsId,
      title: newsTitle,
      link: newsLink,
    },
  };

  dynamodb.put(savedParams);
  newsIdList.push(newsId);
  return newsIdList;
}

/**
 * @description: Delete news
 * @param {string} newsId The id of news
 */
function deleteNews(newsId: string): void {
  try {
    dynamodb.delete({
      TableName: newsTableName,
      Key: {
        newsId: newsId,
      },
    });
  } catch (e) {
    console.log("Delete news with id: " + newsId + " failed, errors: " + e);
  }
}

/**
 * @description: Delete old news according to exist news id list and update new news
 * @param {string} name
 * @param {string[]} oldNewsIds
 * @param {string[]} newNewsIds
 */
async function deleteOldAndUpdateNewNews(
  name: string,
  oldNewsIds: string[],
  newNewsIds: string[]
): Promise<void> {
  if (oldNewsIds) {
    oldNewsIds.forEach((newsId) => deleteNews(newsId));
  }

  // Update the id list to feed
  await updateNewsFeed(name, newNewsIds);
}

/**
 * @description: Get news by feed name and feed type
 * @param {any} name
 * @param {string} type
 * @return {*} news
 */
async function getNewsByNameAndType(name: any, type: string) {
  // Get the feed
  let feedInfos;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(name, type);
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  const newsList: any[] = [];
  const newsIds = feedInfos?.newsIds;
  if (!newsIds) {
    return newsList;
  }

  for (let index = 0; index < newsIds.length; index++) {
    const newsId = newsIds[index];
    const news = await getNews(newsId);
    newsList.push(news);
  }

  return newsList;
}

/**
 * @description: Get all news
 */
export const getAllNews: APIGatewayProxyHandlerV2 = async () => {
  const allNews: object = {};

  for (let index in configs.news) {
    const newsList = await getNewsByNameAndType(
      configs.news[index].name,
      feedTypes.NEWS
    );
    allNews[configs.news[index].name] = newsList;
  }

  return result(status.SUCCESS, JSON.stringify(allNews));
};

/**
 * @description: Update hacker letters news
 */
async function updateHackerNews(): Promise<resultType> {
  // Get the feed
  let feedInfos;
  let feed;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(
      configs.news.hackerNewsletter.name,
      feedTypes.NEWS
    );
    feed = await getFeed(feedInfos);

    if (!feed) {
      return result(status.NOTFOUND, "Feed not found");
    }
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  // Get this week's news
  const weeklyNews = feed.items
    .filter((value: any) => {
      return value.title?.startsWith("Hacker Newsletter #");
    })
    .at(0);
  if (!weeklyNews) {
    return result(status.NOTFOUND, "Weekly news not found");
  }

  // Parse string to html
  if (!weeklyNews.content) {
    return result(status.NOTFOUND, "Weekly news do not have contents");
  }
  const document = parse(weeklyNews.content);

  // Get all news elements
  const newsElements = document
    .getElementById("content")
    .getElementsByTagName("tr")
    .at(2)
    ?.getElementsByTagName("td")
    .at(0)?.childNodes;

  // Find the index of favorite news
  let firstH2: number = -1;
  newsElements
    ?.filter((element) => {
      return element.toString().startsWith("<h2");
    })
    .slice(0, 1)
    .forEach((element) => {
      firstH2 = newsElements.indexOf(element);
    });

  // Find the index of second H2
  let secondH2: number = -1;
  newsElements
    ?.slice(firstH2 + 1)
    .filter((element) => {
      return element.toString().startsWith("<h2");
    })
    .slice(0, 1)
    .forEach((element) => {
      secondH2 = newsElements.indexOf(element);
    });

  // Search from first H2 to second H2 and store all news
  let newsIdList: string[] = [];
  newsElements
    ?.slice(firstH2 + 1, secondH2)
    .filter((element) => {
      return element.toString().startsWith("<p");
    })
    .forEach((element) => {
      // Each element is a news
      const newsElement = parse(element.childNodes.at(0)?.toString() as string);

      const newsTitle = newsElement.text;
      const newsLink = newsElement
        .getElementsByTagName("a")
        .at(0)
        ?.getAttribute("href");

      // Set news id
      const newsId = uuid.v1();

      // Store news to dynamodb
      try {
        newsIdList = createNews(
          newsId,
          newsTitle,
          newsLink as string,
          newsIdList
        );
      } catch (e: unknown) {
        return result(status.FAIL, "Cannot save to dynamodb: " + e);
      }
    });

  // After all news saved, delete all old news and update them
  await deleteOldAndUpdateNewNews(
    configs.news.hackerNewsletter.name,
    feedInfos?.newsIds,
    newsIdList
  );

  return result(status.SUCCESS, "Update hacker news success");
}

/**
 * @description: Update stack overflow news
 */
async function updateOverflowNews(): Promise<resultType> {
  // Get the feed
  let feedInfos;
  let feed;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(configs.news.overflow.name, feedTypes.NEWS);
    feed = await getFeed(feedInfos);

    if (!feed) {
      return result(status.NOTFOUND, "Feed not found");
    }
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  // Get this week's news
  const weeklyNews = feed.items.filter((value: any) => {
    return value.title?.startsWith("The Overflow #");
  });

  // Parse string to html
  if (!weeklyNews[0]) {
    return result(status.NOTFOUND, "Weekly news do not have contents");
  }
  const document = parse(weeklyNews[0]["content:encoded"]);

  // Get all news elements
  const newsElements = document.childNodes;

  // Get the index of first H2
  let firstH2: number = -1;
  newsElements
    ?.filter((element) => {
      return element.toString().startsWith("<h2");
    })
    .slice(0, 1)
    .forEach((element) => {
      firstH2 = newsElements.indexOf(element);
    });

  // Find the index of last post
  let lastPost: number = -1;
  newsElements
    ?.slice(firstH2)
    .filter((element) => {
      return element.toString().startsWith("<p");
    })
    .filter((element) => {
      return element.text.includes("A blast from the past");
    })
    .forEach((element: any) => {
      lastPost = newsElements.indexOf(element);
    });

  // Search the news
  let newsIdList: string[] = [];
  newsElements
    ?.slice(firstH2, lastPost)
    .filter((element) => {
      return element.toString().startsWith("<p");
    })
    .forEach((element) => {
      // Each element is a news
      const newsElement = parse(element.childNodes.at(0)?.toString() as string);

      const newsTitle = newsElement.text;
      const newsLink = newsElement
        .getElementsByTagName("a")
        .at(0)
        ?.getAttribute("href");

      // Set news id
      const newsId = uuid.v1();

      // Store news to dynamodb
      try {
        newsIdList = createNews(
          newsId,
          newsTitle,
          newsLink as string,
          newsIdList
        );
      } catch (e: unknown) {
        return result(status.FAIL, "Cannot save to dynamodb: " + e);
      }
    });

  // After all news saved, delete all old news and update them
  await deleteOldAndUpdateNewNews(
    configs.news.overflow.name,
    feedInfos?.newsIds,
    newsIdList
  );

  return result(status.SUCCESS, "Update overflow news success");
}

/**
 * @description: Update infoQ news
 */
async function updateInfoQNews() {
  // Get the feed
  let feedInfos;
  let feed;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(configs.news.InfoQ.name, feedTypes.NEWS);
    feed = await getFeed(feedInfos);

    if (!feed) {
      return result(status.NOTFOUND, "Feed not found");
    }
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  // Get this week's news, and save
  let newsIdList: string[] = [];
  feed.items.filter((value: any) => {
    const newsTitle = value.title;
    const newsLink = value.link;

    // Set news id
    const newsId = uuid.v1();

    // Store news to dynamodb
    try {
      newsIdList = createNews(
        newsId,
        newsTitle,
        newsLink as string,
        newsIdList
      );
    } catch (e: unknown) {
      return result(status.FAIL, "Cannot save to dynamodb: " + e);
    }
  });

  // After all news saved, delete all old news and update them
  await deleteOldAndUpdateNewNews(
    configs.news.InfoQ.name,
    feedInfos?.newsIds,
    newsIdList
  );

  return result(status.SUCCESS, "Update infoQ news success");
}

/**
 * @description: Lambda function to update all news
 */
export const updateAllNews: APIGatewayProxyHandlerV2 = async () => {
  const updateHackerNewsResult: resultType = await updateHackerNews();
  if (updateHackerNewsResult.statusCode != status.SUCCESS) {
    return updateHackerNewsResult;
  }

  const updateOverflowNewsResult: resultType = await updateOverflowNews();
  if (updateOverflowNewsResult.statusCode != status.SUCCESS) {
    return updateOverflowNewsResult;
  }

  const updateInfoQNewsResult: resultType = await updateInfoQNews();
  if (updateInfoQNewsResult.statusCode != status.SUCCESS) {
    return updateInfoQNewsResult;
  }

  return result(status.SUCCESS, "Update all news success");
};
