/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 11:49:51
 * @LastEditTime: 2021-01-14 15:49:59
 */
import UUZ from '../../framework';
import { AudioMessage, FileMesage as FileMessage, ImageMessage, KMarkDownMessage, TextMessage, VideoMessage } from '../../framework/types/shugen.type';

export interface Handler {
  channel?: {
    allow: string[];
    deny: string[];
  };
  enable: boolean;
  onInit?: {
    (res: {
      uuz: UUZ;
    }): void;
  };
  onRaw?: {
    (res: {
      uuz: UUZ;
      data: any;
    }): void;
  };
  onSystem?: {
    (res: {
      uuz: UUZ;
      data: any;
    }): void;
  };
  onText?: {
    (res: {
      uuz: UUZ;
      data: TextMessage;
    }): void;
  };
  onImage?: {
    (res: {
      uuz: UUZ;
      data: ImageMessage;
    }): void;
  };
  onVideo?: {
    (res: {
      uuz: UUZ;
      data: VideoMessage;
    }): void;
  };
  onFile?: {
    (res: {
      uuz: UUZ;
      data: FileMessage;
    }): void;
  };
  onAudio?: {
    (res: {
      uuz: UUZ;
      data: AudioMessage;
    }): void;
  };
  onKMarkdown?: {
    (res: {
      uuz: UUZ;
      data: KMarkDownMessage;
    }): void;
  };
  onUnknown?: {
    (res: {
      uuz: UUZ;
      data: any;
    }): void;
  };
  onError?: {
    (res: {
      uuz: UUZ;
      data: any;
    }): void;
  };
  onChallenge?: {
    (res: {
      uuz: UUZ;
      data: any;
    }): void;
  };
}

export interface Filter {
  data: any;
  hdl: Handler;
  cb: {
    (hdl: Handler): void;
  };
}
