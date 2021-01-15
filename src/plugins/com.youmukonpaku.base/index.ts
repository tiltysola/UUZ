/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 16:14:02
 * @LastEditTime: 2021-01-15 17:06:18
 */
import UUZ from '../../framework';
import { TextMessage, Handler } from '../types';

const getChannelId = (data: TextMessage, uuz: UUZ) => {
  uuz.sendGroupMsg.sendTextMsg(data.channelId, `当前频道ID：${data.channelId}`);
};

const commands: any = {
  获取频道id: getChannelId,
};

const handler: Handler = {
  enable: true,
  onText: ({ data, uuz }) => {
    if (commands[data.content.toLowerCase()]) {
      commands[data.content.toLowerCase()](data, uuz);
    }
  },
};

export default handler;
