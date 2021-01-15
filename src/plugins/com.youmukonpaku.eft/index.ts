/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-15 17:19:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/src/plugins/com.youmukonpaku.eft/index.ts
 */
import request from 'request';
import UUZ from '../../framework';
import Card from '../../framework/card';
import { Handler } from '../types';

import config from './config';

const { api } = config;

const sendPriceMsg = (uuz: UUZ, channelId: string, msg: any, os: string) => {
  if (os === 'iOS') {
    uuz.sendGroupMsg.sendKMarkdownMsg(channelId, msg.map((v: any) => {
      return `***${v.name}***\n` +
      `最近成交价格： ${v.price}₽\n` +
      `基准价格： ${v.basePrice}₽\n` +
      `24小时成交价格： ${v.avg24hPrice}₽ (${v.diff24h > 0 ? '+' : ''}${v.diff24h}%)\n` +
      `近7日成交价格： ${v.avg7daysPrice}₽ (${v.diff7days > 0 ? '+' : ''}${v.diff7days}%)\n` +
      `${v.traderName}价格： ${v.traderPrice}${v.traderPriceCur}`;
    }).join('\n'));
  } else {
    uuz.sendGroupMsg.sendCardMsg(channelId, msg.map((v: any) => {
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
              src: `${api}image?uid=${v.uid}`,
              circle: false,
            }),
          }),
        ],
      });
    }));
  }
};

const sendAmmoMsg = (uuz: UUZ, channelId: string, msg: any) => {
  uuz.sendGroupMsg.sendKMarkdownMsg(channelId, `弹药类型\t\t伤害\t\t穿甲\t\t甲伤\t\t精准度\t后座力\t碎弹率\n${
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

const getPrice = (uuz: UUZ, channelId: string, msg: string, os: string) => {
  request({
    url: `${api}flea/rank?item=${encodeURIComponent(msg)}&limit=5`,
    method: 'get',
  }, (err, res, body) => {
    if (err) throw (err);
    if (res.statusCode === 200 && body) {
      const json = JSON.parse(body);
      if (json.length > 0) {
        sendPriceMsg(uuz, channelId, json, os);
      } else {
        uuz.sendGroupMsg.sendTextMsg(channelId, '没有找到相关物品物价信息。');
      }
    }
  });
};

const getAmmo = (uuz: UUZ, channelId: string, msg: string) => {
  request({
    url: `${api}ammo?item=${encodeURIComponent(msg)}&limit=5`,
    method: 'get',
  }, (err, res, body) => {
    if (err) throw (err);
    if (res.statusCode === 200 && body) {
      const json = JSON.parse(body);
      if (json.length > 0) {
        sendAmmoMsg(uuz, channelId, json);
      } else {
        uuz.sendGroupMsg.sendTextMsg(channelId, '没有找到相关物品弹药信息。');
      }
    }
  });
};

const commands: any = {
  物价: getPrice,
  price: getPrice,
  弹药: getAmmo,
  ammo: getAmmo,
};

const handler: Handler = {
  enable: true,
  onText: ({ data, uuz }) => {
    console.log(data);
    if (['.', '!', '！'].includes(data.content.substr(0, 1))) {
      const msg = data.content.substr(1).split(' ');
      if (commands[msg[0].toLowerCase()]) {
        commands[msg[0].toLowerCase()](uuz, data.channelId, msg[1], data.author.os);
      }
    }
  },
};

export default handler;
