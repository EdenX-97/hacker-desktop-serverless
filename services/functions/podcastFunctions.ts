import {
  getFeedInfos,
  getFeed,
  updatePodcastFeed,
} from "../functions/feedFunctions";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import dynamodb from "./../utils/dynamodb";
import configs from "./../../configs.json";
import feedTypes from "./../enums/feedTypes";
import status from "./../enums/status";
import { result, resultType } from "./../utils/result";
import * as uuid from "uuid";

// Get table name from env
const podcastsTableName = process.env.TABLE_NAME_PODCASTS;

/**
 * @description: Get podcast
 * @param {string} podcastId The id of podcast
 */
async function getPodcast(podcastId: string) {
  const podcast = await dynamodb.get({
    TableName: podcastsTableName,
    Key: {
      podcastId: podcastId,
    },
  });
  return podcast?.Item;
}

/**
 * @description: Create news to dynamodb
 * @param {string} podcastId
 * @param {string} podcastTitle
 * @param {string} podcastLink
 * @param {string} podcastImage
 */
function createPodcast(
  podcastId: string,
  podcastTitle: string,
  podcastLink: string,
  podcastImage: string
): void {
  // Do not save if any param is undefined
  if (!podcastId || !podcastTitle || !podcastLink || !podcastImage) {
    return;
  }

  // Define saved params
  const savedParams = {
    TableName: podcastsTableName,
    Item: {
      podcastId: podcastId,
      title: podcastTitle,
      link: podcastLink,
      image: podcastImage,
    },
  };

  dynamodb.put(savedParams);
}

/**
 * @description: Delete podcast
 * @param {string} podcastId
 */
function deletePodcast(podcastId: string): void {
  try {
    dynamodb.delete({
      TableName: podcastsTableName,
      Key: {
        podcastId: podcastId,
      },
    });
  } catch (e) {
    console.log(
      "Delete podcast with id: " + podcastId + " failed, errors: " + e
    );
  }
}

/**
 * @description: Delete old podcast according to exist podcast id and update new one
 */
async function deleteOldAndUpdateNewPodcast(
  name: string,
  oldPodcastId: string,
  newPodcastId: string
): Promise<void> {
  if (oldPodcastId) {
    deletePodcast(oldPodcastId);
  }

  await updatePodcastFeed(name, newPodcastId);
}

/**
 * @description: Get podcast by feed name and feed type
 * @param {any} name
 * @param {string} type
 * @return {*} podcast
 */
async function getPodcastByNameAndType(name: any, type: string) {
  // Get the feed
  let feedInfos;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(name, type);
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  let podCast: any;
  const podcastId = feedInfos?.podcastId;
  if (!podcastId) {
    return podCast;
  }

  podCast = await getPodcast(podcastId);

  return podCast;
}

/**
 * @description: Get all podcasts
 */
export const getAllPodcasts: APIGatewayProxyHandlerV2 = async () => {
  const allPodcasts: object = {};

  for (let index in configs.podcasts) {
    const postcast = await getPodcastByNameAndType(
      configs.podcasts[index].name,
      feedTypes.PODCAST
    );
    allPodcasts[configs.podcasts[index].name] = postcast;
  }

  return result(status.SUCCESS, JSON.stringify(allPodcasts));
};

async function updatePodcastMethodOne(feedName: string): Promise<resultType> {
  // Get the feed
  let feedInfos;
  let feed;
  try {
    // Get feed infos from dynamodb
    feedInfos = await getFeedInfos(feedName, feedTypes.PODCAST);
    feed = await getFeed(feedInfos);

    if (!feed) {
      return result(status.NOTFOUND, "Feed not found");
    }
  } catch (e) {
    return result(status.FAIL, "Get feed fail: " + e);
  }

  const podcastId = uuid.v1();
  const podcastTitle = feed.items.at(0).title;
  const podcastLink = feed.items.at(0).enclosure.url;
  const podcastImage = feed.itunes.image;

  // Store podcast to dynamodb
  try {
    createPodcast(podcastId, podcastTitle, podcastLink, podcastImage);
  } catch (e: unknown) {
    return result(status.FAIL, "Cannot save to dynamodb: " + e);
  }

  // After podcast saved, add its id to feed
  await deleteOldAndUpdateNewPodcast(feedName, feedInfos?.podcastId, podcastId);

  return result(status.SUCCESS, "Update " + feedName + "podcast success");
}

/**
 * @description: Update acciddental tech podcast
 */
async function updateAccidentalTechPodcast(): Promise<resultType> {
  return await updatePodcastMethodOne(configs.podcasts.accidentalTech.name);
}

/**
 * @description: Update developer tea podcast
 */
async function updateDeveloperTeaPodcast(): Promise<resultType> {
  return await updatePodcastMethodOne(configs.podcasts.developerTea.name);
}

/**
 * @description: Update software engineering daily podcast
 */
async function updateSoftwareEngineeringDailyPodcast(): Promise<resultType> {
  return await updatePodcastMethodOne(
    configs.podcasts.softwareEngineeringDaily.name
  );
}

/**
 * @description: Update changelog podcast
 */
async function updateChangelogPodcast(): Promise<resultType> {
  return await updatePodcastMethodOne(configs.podcasts.changelog.name);
}

/**
 * @description: Update codeNewbie podcast
 */
async function updateCodeNewbiePodcast(): Promise<resultType> {
  return await updatePodcastMethodOne(configs.podcasts.codeNewbie.name);
}

/**
 * @description: Lambda function to update all podcasts
 */
export const updateAllPodcasts: APIGatewayProxyHandlerV2 = async () => {
  const updateAccidentalTechPodcastResult: resultType =
    await updateAccidentalTechPodcast();
  if (updateAccidentalTechPodcastResult.statusCode != status.SUCCESS) {
    return updateAccidentalTechPodcastResult;
  }

  const updateDeveloperTeaPodcastResult: resultType =
    await updateDeveloperTeaPodcast();
  if (updateDeveloperTeaPodcastResult.statusCode != status.SUCCESS) {
    return updateDeveloperTeaPodcastResult;
  }

  const updateSoftwareEngineeringDailyPodcastResult: resultType =
    await updateSoftwareEngineeringDailyPodcast();
  if (
    updateSoftwareEngineeringDailyPodcastResult.statusCode != status.SUCCESS
  ) {
    return updateSoftwareEngineeringDailyPodcastResult;
  }

  const updateChangelogPodcastResult: resultType =
    await updateChangelogPodcast();
  if (updateChangelogPodcastResult.statusCode != status.SUCCESS) {
    return updateChangelogPodcastResult;
  }

  const updateCodeNewbiePodcastResult: resultType =
    await updateCodeNewbiePodcast();
  if (updateCodeNewbiePodcastResult.statusCode != status.SUCCESS) {
    return updateCodeNewbiePodcastResult;
  }

  return result(status.SUCCESS, "Update all podcasts success");
};
