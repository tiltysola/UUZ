/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-15 11:56:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/src/plugins/com.youmukonpaku.eft/index.ts
 */
import request from 'request';
import UUZ from '../../framework';
import Card from '../../framework/card';
import { TextMessage, Handler } from '../types';

const sendMsg = (uuz: UUZ, data: TextMessage, msg: any) => {
  uuz.sendGroupMsg.sendCardMsg(data.channelId, msg.map((v: any) => {
    return new Card.Card({
      modules: [
        new Card.TitleModule({
          text: {
            type: 'plain-text',
            content: `${v.name}`,
          },
        }),
        new Card.ContentModule({
          mode: 'left',
          text: new Card.KmarkdownElement({
            content: `最近成交价格： ${v.price}₽\n` +
            `基准价格： ${v.basePrice}₽\n` +
            `24小时成交价格： ${v.avg24hPrice}₽ (${v.diff24h > 0 ? '+' : ''}${v.diff24h}%)\n` +
            `近7日成交价格： ${v.avg7daysPrice}₽ (${v.diff7days > 0 ? '+' : ''}${v.diff7days}%)\n` +
            `${v.traderName}价格： ${v.traderPrice}${v.traderPriceCur}\n`,
          }),
          accessory: new Card.ImageElement({
            src: `https://eft.acgme.cn/image?uid=${v.uid}`,
            circle: false,
          }),
        }),
      ],
    });
  }));
};

const sendMsgAmmo = (uuz: UUZ, data: TextMessage, msg: any) => {
  uuz.sendGroupMsg.sendKMarkdownMsg(data.channelId, `弹药类型\t\t伤害\t\t穿甲\t\t甲伤\t\t精准度\t后座力\t碎弹率\n${
    msg.map((v: any) => {
      return `**${v.shortName}**\t${v.shortName.length < 4 ? '\t' : ''}${v.shortName.length < 8 ? '\t' : ''}` +
        `${v.damage}\t\t` +
        `${v.penetration}\t\t` +
        `${v.armorDamage}%\t\t` +
        `${v.accuracy}\t\t` +
        `${v.recoil}\t\t` +
        `${Math.floor(v.fragmentation * 100)}%`;
    }).join('\n')}`);
};

const handler: Handler = {
  enable: true,
  onText: ({ data, uuz }) => {
    if (['.', '!', '！'].includes(data.content.substr(0, 1))) {
      const msg = data.content.substr(1).split(' ');
      if (msg[0] === '物价' || msg[0] === 'price') {
        request({
          url: `https://eft.acgme.cn/flea/rank?item=${encodeURIComponent(msg[1])}&limit=5`,
          method: 'get',
        }, (err, res, body) => {
          if (err) throw (err);
          if (res.statusCode === 200 && body) {
            sendMsg(uuz, data, JSON.parse(body));
          }
        });
      } else if (msg[0] === '弹药' || msg[0] === 'ammo') {
        request({
          url: `https://eft.acgme.cn/ammo?item=${encodeURIComponent(msg[1])}&limit=5`,
          method: 'get',
        }, (err, res, body) => {
          if (err) throw (err);
          if (res.statusCode === 200 && body) {
            sendMsgAmmo(uuz, data, JSON.parse(body));
          }
        });
      }
    }
  },
};

export default handler;
