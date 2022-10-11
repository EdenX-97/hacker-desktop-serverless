/*
 * @Description: Regex check util
 * @Author: Mo Xu
 * @Date: 2022-10-07 15:51:56
 * @LastEditors: Mo Xu
 * @LastEditTime: 2022-10-07 15:55:54
 */

const urlRegex: RegExp = /^(http(s)?:\/\/)\w+[^\s]+(\.[^\s]+){1,}$/;
const emailRegex: RegExp =
  /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export function checkUrl(url: string): boolean {
  return urlRegex.test(url);
}

export function checkEmail(email: string): boolean {
  return emailRegex.test(email);
}
