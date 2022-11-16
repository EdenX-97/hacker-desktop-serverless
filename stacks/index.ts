/*
 * @Description: Register all stacks
 * @Author: Mo Xu
 * @Date: 2022-10-01 00:29:32
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-11-15 17:34:36
 */
import { App } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";
import { FrontendStack } from "./FrontendStack";
import { ScheduleStack } from "./ScheduleStack";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });

  app
    .stack(StorageStack)
    .stack(ApiStack)
    .stack(FrontendStack)
    .stack(ScheduleStack);
}
