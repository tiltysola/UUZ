/*
 * @Author: your name
 * @Date: 2021-01-13 20:39:14
 * @LastEditTime: 2021-01-14 15:41:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/src/plugins/com.youmukonpaku.eft/index.ts
 */
import request from 'request';
import UUZ from '../../framework';
import { Handler } from '../../handler/types/index.type';

const sendMsg = (uuz: UUZ, data: any, msg: any) => {
  uuz.sendGroupMsg.sendCardMsg(data.target_id, msg.map((v: any) => {
    return {
      type: 'card',
      theme: 'info',
      color: '#aaaaaa',
      modules: [
        {
          type: 'header',
          text: {
            type: 'plain-text',
            content: `${v.name}`,
          },
        },
        {
          type: 'section',
          mode: 'left',
          text: {
            type: 'kmarkdown',
            content: `最近成交价格： ${v.price}₽\n` +
            `基准价格： ${v.basePrice}₽\n` +
            `24小时成交价格： ${v.avg24hPrice}₽ (${v.diff24h > 0 ? '+' : ''}${v.diff24h}%)\n` +
            `近7日成交价格： ${v.avg7daysPrice}₽ (${v.diff7days > 0 ? '+' : ''}${v.diff7days}%)\n` +
            `${v.traderName}价格： ${v.traderPrice}${v.traderPriceCur}\n`,
            emoji: false,
          },
          accessory: {
            type: 'image',
            src: `https://eft.acgme.cn/image?uid=${v.uid}`,
            circle: false,
          },
        },
      ],
    };
  }));
};

const sendMsgAmmo = (uuz: UUZ, data: any, msg: any) => {
  uuz.sendGroupMsg.sendKMarkdownMsg(data.target_id, `弹药类型\t\t伤害\t\t穿甲\t\t甲伤\t\t精准度\t后座力\t碎弹率\n${
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
  onRaw: ({ data, uuz }) => {
    if (data.content.substr(0, 1) === '!') {
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
