/*
 * @Description: Packaged DynamoDB interfaces
 * @Author: Mo Xu
 * @Date: 2022-10-06 00:08:06
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-14 02:07:33
 */
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const client = new DocumentClient();

export default {
  get: (params: any) => client.get(params).promise(),
  put: (params: any) => client.put(params).promise(),
  query: (params: any) => client.query(params).promise(),
  update: (params: any) => client.update(params).promise(),
  delete: (params: any) => client.delete(params).promise(),
};
