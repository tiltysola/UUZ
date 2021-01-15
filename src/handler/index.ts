/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 11:48:52
 * @LastEditTime: 2021-01-16 00:07:55
 */
import fs from 'fs';
import path from 'path';

import UUZ from '../framework';
import { Handler, Filter } from './types/index.type';
import { AudioMessage, FileMessage, ImageMessage, KMarkDownMessage, TextMessage, VideoMessage } from '../framework/types/custom.type';

const defaultConfig: Handler = {
  channel: {
    allow: ['*'],
    deny: [],
  },
  enable: true,
  onInit: () => {},
  onRaw: () => {},
};

const filter = ({ data, hdl, cb }: Filter, enable = false) => {
  // Ava: TextMsg, ImageMsg, VideoMsg, FileMsg, AudioMsg, KMarkdownMsg
  if (enable) {
    if (data.channelType === 'GROUP') {
      if (data.channelId && hdl.channel && (
        hdl.channel.allow.includes('*') ||
        hdl.channel.allow.includes(data.channelId)
      )) {
        cb(hdl);
      }
    } else {
      cb(hdl);
    }
  } else {
    cb(hdl);
  }
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
      uuz.on('text', (data: TextMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onText && hdl.onText({ data, uuz });
          },
          data,
        }, true);
      });
      uuz.on('image', (data: ImageMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onImage && hdl.onImage({ data, uuz });
          },
          data,
        }, true);
      });
      uuz.on('video', (data: VideoMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onVideo && hdl.onVideo({ data, uuz });
          },
          data,
        }, true);
      });
      uuz.on('file', (data: FileMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onFile && hdl.onFile({ data, uuz });
          },
          data,
        }, true);
      });
      uuz.on('audio', (data: AudioMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onAudio && hdl.onAudio({ data, uuz });
          },
          data,
        }, true);
      });
      uuz.on('kmarkdown', (data: KMarkDownMessage) => {
        filter({
          hdl: hdlQueue[i],
          cb: (hdl) => {
            hdl.onKMarkdown && hdl.onKMarkdown({ data, uuz });
          },
          data,
        }, true);
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
