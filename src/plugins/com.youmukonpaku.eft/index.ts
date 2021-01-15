/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-15 23:56:26
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

let globalRateLimit = 0;

const sendPriceMsg = (uuz: UUZ, channelId: string, msg: any, os: string) => {
  if (os === 'iOS') {
    uuz.sendGroupMsg.sendKMarkdownMsg(channelId, msg.map((v: any) => {
      return `> **${v.name}**\n` +
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
  uuz.sendGroupMsg.sendKMarkdownMsg(channelId, `> 弹药类型\t\t伤害\t\t穿甲\t\t甲伤\t\t精准度\t后座力\t碎弹率\n${
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

const getHelp = (uuz: UUZ, channelId: string) => {
  uuz.sendGroupMsg.sendKMarkdownMsg(channelId, '> **幽幽子机器人帮助** `开源地址：https://github.com/AlishaHawkward/UUZ`\n' +
    '1. 获取塔科夫物价：!price <物品名称>\n' +
    '2. 获取子弹信息：!ammo <子弹名称>\n' +
    '3. 获取地图帮助：!map\n');
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

const getMap = (uuz: UUZ, channelId: string) => {
  uuz.sendGroupMsg.sendCardMsg(channelId, [new Card.Card({
    modules: [
      new Card.TitleModule({
        text: {
          type: 'plain-text',
          content: '请选择您要查看的地图',
        },
      }),
      new Card.ActionModule({
        elements: [
          new Card.ButtonElement({
            value: `map/shoreline/${channelId}`,
            click: 'return-val',
            text: '海岸线',
          }),
          new Card.ButtonElement({
            value: `map/customs/${channelId}`,
            click: 'return-val',
            text: '海关',
          }),
          new Card.ButtonElement({
            value: `map/reserve/${channelId}`,
            click: 'return-val',
            text: '储备站',
          }),
          new Card.ButtonElement({
            value: `map/interchange/${channelId}`,
            click: 'return-val',
            text: '立交桥',
          }),
        ],
      }),
      new Card.ActionModule({
        elements: [
          new Card.ButtonElement({
            value: `map/woods/${channelId}`,
            click: 'return-val',
            text: '森林',
          }),
        ],
      }),
    ],
  })]);
};

const commands: any = {
  帮助: getHelp,
  help: getHelp,
  物价: getPrice,
  price: getPrice,
  弹药: getAmmo,
  ammo: getAmmo,
  地图: getMap,
  map: getMap,
};

const handler: Handler = {
  enable: true,
  onText: ({ data, uuz }) => {
    if (['.', '!', '！'].includes(data.content.substr(0, 1))) {
      const msg = data.content.substr(1).split(' ');
      if (commands[msg[0].toLowerCase()]) {
        commands[msg[0].toLowerCase()](uuz, data.channelId, msg[1], data.author.os);
      }
    }
  },
  onSystem: ({ data, uuz }) => {
    if (data.channel_type === 'PERSON' && data.extra?.body?.value) {
      const msg = data.extra.body.value.split('/');
      if (msg[0] === 'map') {
        if (globalRateLimit > new Date().getTime() - 5000) {
          uuz.sendGroupMsg.sendTextMsg(msg[2], '操作太快了，休息一会儿吧。');
        } else {
          globalRateLimit = new Date().getTime();
          if (msg[1] === 'shoreline') {
            uuz.sendGroupMsg.sendTextMsg(msg[2], 'https://oss.acgme.cn/eft/maps/shoreline/Overview.jpg');
          } else if (msg[1] === 'customs') {
            uuz.sendGroupMsg.sendTextMsg(msg[2], 'http://oss.acgme.cn/eft/maps/customs/Overview.png');
          } else if (msg[1] === 'reserve') {
            uuz.sendGroupMsg.sendTextMsg(msg[2], 'http://oss.acgme.cn/eft/maps/reserve/Overview.png');
          } else if (msg[1] === 'interchange') {
            uuz.sendGroupMsg.sendTextMsg(msg[2], 'http://oss.acgme.cn/eft/maps/interchange/Overview.png');
          } else if (msg[1] === 'woods') {
            uuz.sendGroupMsg.sendTextMsg(msg[2], 'http://oss.acgme.cn/eft/maps/woods/Overview.png');
          }
        }
      }
    }
  },
};

export default handler;
