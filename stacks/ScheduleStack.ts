/*
 * @Description: Schedule tasks
 * @Author: Mo Xu
 * @Date: 2022-11-15 17:30:08
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-11-16 11:08:14
 */

import { StackContext } from "@serverless-stack/resources";
import { Cron } from "@serverless-stack/resources";

export function ScheduleStack({ stack, app }: StackContext) {
  const everyMondayMorningCron = "cron(0 3 ? * 1 *)";

  // Schedule to update news, every monday morning
  new Cron(stack, "AutoUpdateNews", {
    schedule: everyMondayMorningCron,
    job: "functions/newsFunctions.updateAllNews",
  });

  // Schedule to update podcasts, every monday morning
  new Cron(stack, "AutoUpdatePodcasts", {
    schedule: everyMondayMorningCron,
    job: "functions/podcastFunctions.updateAllPodcasts",
  });

  // Schedule to update billing, every monday morning
  new Cron(stack, "AutoUpdatePodcasts", {
    schedule: everyMondayMorningCron,
    job: "functions/costFunctions.updateBilling",
  });
}
