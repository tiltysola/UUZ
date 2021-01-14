/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 10:42:47
 * @LastEditTime: 2021-01-14 15:57:10
 */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import events from 'events';
import { cloneDeep } from 'lodash';
import UMsg, { UGroupMsg } from './msg';
import { decryptRequest } from './utils';

import { UConfig, UEventEmitter, UConfigEncrypt, USN } from './types/uuz.type';
import { KaiheilaEventRequest } from './types/kaiheila.type';
import { AudioMessage, FileMesage as FileMessage, ImageMessage, KMarkDownMessage, TextMessage, VideoMessage } from './types/shugen.type';

class UUZ extends events.EventEmitter implements UEventEmitter {
  private app: Koa;
  private config: UConfig | UConfigEncrypt;
  private snMap: USN = {};

  private UMsg: UMsg;
  sendGroupMsg: UGroupMsg;

  constructor(config: UConfig | UConfigEncrypt) {
    super();
    this.app = new Koa();
    this.config = config;

    this.app.use(bodyParser());

    this.app.use(async (ctx) => {
      let request = cloneDeep(ctx.request.body);

      if (ctx.request.body.encrypt) {
        if (this.config.encrypt) {
          try {
            request = decryptRequest(ctx.request.body, this.config.key);
          } catch (e) {
            this.emit('error', e);
          }
        } else {
          this.emit('error', 'Undecrypted message!');
          return;
        }
      }

      this.verifyRequest(request);

      this.handleChallenge(request, ctx);

      ctx.status = 200;

      this.handleSN(request);

      this.handleMessage(request);
    });

    this.UMsg = new UMsg(this.config.token);
    this.sendGroupMsg = this.UMsg.sendGroupMsg;
  }

  listen(port: number) {
    this.app.listen(port);
  }

  private verifyRequest(request: KaiheilaEventRequest) {
    if (typeof request !== 'object' || typeof request.s !== 'number' || typeof request.d !== 'object') {
      this.emit('error', 'Unknown message!');
    }
  }

  private handleChallenge(request: KaiheilaEventRequest, ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    if (request.d.type === 255 && request.d.channel_type === 'WEBHOOK_CHALLENGE') {
      ctx.body = {
        challenge: request.d.challenge,
      };
      this.emit('challenge', request.d.challenge);
    }
  }

  private handleSN(request: KaiheilaEventRequest) {
    if (this.snMap[request.sn as number] && this.snMap[request.sn as number] - Date.now() < 1000 * 600) {
      this.emit('error', 'Message has been handled already!');
      return false;
    }
    this.snMap[request.sn as number] = Date.now();
  }

  private handleMessage(request: KaiheilaEventRequest) {
    try {
      this.emit('raw', cloneDeep(request.d));
    } catch (e) {
      this.emit('error', e);
    }

    switch (request.d.type) {
      case 255:
        this.emit('system', cloneDeep(request.d));
        break;
      case 1:
        this.emit('text', new TextMessage(cloneDeep(request.d)));
        break;
      case 2:
        this.emit('image', new ImageMessage(cloneDeep(request.d)));
        break;
      case 3:
        this.emit('video', new VideoMessage(cloneDeep(request.d)));
        break;
      case 4:
        this.emit('file', new FileMessage(cloneDeep(request.d)));
        break;
      case 8:
        this.emit('audio', new AudioMessage(cloneDeep(request.d)));
        break;
      case 9:
        this.emit('kmarkdown', new KMarkDownMessage(cloneDeep(request.d)));
        break;
      default:
        this.emit('unknown', cloneDeep(request.d));
        break;
    }
  }
}

export default UUZ;
