/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 11:48:52
 * @LastEditTime: 2021-01-14 15:50:21
 */
import fs from 'fs';
import path from 'path';

import UUZ from '../framework';
import { Handler, Filter } from './types/index.type';

const defaultConfig: Handler = {
  channel: {
    allow: [],
    deny: [],
  },
  enable: true,
  onInit: () => {},
  onRaw: () => {},
};

const filter = ({ hdl, cb }: Filter) => {
  cb(hdl);
};

const handler = (uuz: UUZ) => {
  const hdlQueue: Handler[] = [];
  const pluginsDir = path.join(__dirname, '../plugins');

  if (fs.existsSync(pluginsDir)) {
    fs.readdirSync(pluginsDir).forEach((v) => {
      if (fs.statSync(path.join(pluginsDir, v)).isFile()) {
        return;
      }
      const msgHdl = {
        ...defaultConfig,
        // eslint-disable-next-line
        ...require(path.join(pluginsDir, v)).default,
      };
      if (msgHdl.enable) {
        hdlQueue.push(msgHdl);
        msgHdl.onInit && msgHdl.onInit({ uuz });
      }
    });

    for (let i = 0; i < hdlQueue.length; i++) {
      uuz.on('raw', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onRaw && hdl.onRaw({ data, uuz });
          },
          data,
        });
      });
      uuz.on('system', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onSystem && hdl.onSystem({ data, uuz });
          },
          data,
        });
      });
      uuz.on('text', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onText && hdl.onText({ data, uuz });
          },
          data,
        });
      });
      uuz.on('image', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onImage && hdl.onImage({ data, uuz });
          },
          data,
        });
      });
      uuz.on('video', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onVideo && hdl.onVideo({ data, uuz });
          },
          data,
        });
      });
      uuz.on('file', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onFile && hdl.onFile({ data, uuz });
          },
          data,
        });
      });
      uuz.on('audio', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onAudio && hdl.onAudio({ data, uuz });
          },
          data,
        });
      });
      uuz.on('kmarkdown', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onKMarkdown && hdl.onKMarkdown({ data, uuz });
          },
          data,
        });
      });
      uuz.on('unknown', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onUnknown && hdl.onUnknown({ data, uuz });
          },
          data,
        });
      });
      uuz.on('error', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onError && hdl.onError({ data, uuz });
          },
          data,
        });
      });
      uuz.on('challenge', (data: any) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onChallenge && hdl.onChallenge({ data, uuz });
          },
          data,
        });
      });
    }
  }
};

export default handler;
