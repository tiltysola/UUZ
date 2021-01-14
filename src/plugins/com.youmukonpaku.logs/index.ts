/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-14 15:57:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/src/plugins/com.youmukonpaku.eft/index.ts
 */
import { Handler } from '../../handler/types/index.type';

const handler: Handler = {
  enable: true,
  onRaw: ({ data }) => {
    // eslint-disable-next-line
    console.log(JSON.stringify(data));
  },
};

export default handler;
