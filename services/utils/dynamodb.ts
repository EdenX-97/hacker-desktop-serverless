/*
 * @Description: Packaged DynamoDB interfaces
 * @Author: Mo Xu
 * @Date: 2022-10-06 00:08:06
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-07 01:34:09
 */
import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export default {
  get: (params: any) => client.get(params).promise(),
  put: (params: any) => client.put(params).promise(),
  query: (params: any) => client.query(params).promise(),
  update: (params: any) => client.update(params).promise(),
  delete: (params: any) => client.delete(params).promise(),
};
