export type resultType = {
  statusCode: number;
  body: string;
};

export function result(statusCode: number, body: string): resultType {
  return {
    statusCode: statusCode,
    body: body,
  };
}
