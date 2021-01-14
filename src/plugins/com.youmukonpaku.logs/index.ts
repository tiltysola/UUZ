/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-14 16:41:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/src/plugins/com.youmukonpaku.eft/index.ts
 */
import { Handler } from '../types';

const handler: Handler = {
  enable: true,
  onRaw: ({ data }) => {
    // eslint-disable-next-line
    console.log(JSON.stringify(data));
  },
  onError: ({ data }) => {
    try {
      // eslint-disable-next-line
      console.error(JSON.stringify(data));
    } catch (e) {
      // eslint-disable-next-line
      console.error(data);
    }
  },
};

export default handler;
