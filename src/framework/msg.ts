/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 15:19:43
 * @LastEditTime: 2021-01-15 17:56:42
 */
import request from 'request';
import { Card } from './types/card.type';

class UMsg {
  sendGroupMsg: UGroupMsg;

  constructor(token: string) {
    this.sendGroupMsg = new UGroupMsg(token);
  }
}

export class UGroupMsg {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  sendTextMsg(channel: string, content: string) {
    sendRequest(this.token, JSON.stringify({
      object_name: 1,
      channel_id: channel,
      content,
    }));
  }

  sendKMarkdownMsg(channel: string, content: string) {
    sendRequest(this.token, JSON.stringify({
      object_name: 9,
      channel_id: channel,
      content,
    }));
  }

  sendCardMsg(channel: string, card: Card | Card[]) {
    sendRequest(this.token, JSON.stringify({
      object_name: 10,
      channel_id: channel,
      content: JSON.stringify(card),
    }));
  }
}

function sendRequest(token: string, body: string) {
  request({
    url: 'https://www.kaiheila.cn/api/v3/channel/message',
    method: 'post',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  }, (err) => {
    if (err) throw err;
  });
}

export default UMsg;
