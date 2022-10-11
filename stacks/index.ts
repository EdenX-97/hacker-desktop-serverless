/*
 * @Description: Register all stacks
 * @Author: Mo Xu
 * @Date: 2022-10-01 00:29:32
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-08 23:59:50
 */
import { StorageStack } from "./StorageStack";
import { App } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import { FrontendStack } from "./FrontendStack";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.stack(StorageStack).stack(ApiStack).stack(FrontendStack);
}
