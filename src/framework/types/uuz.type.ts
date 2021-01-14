/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 10:48:08
 * @LastEditTime: 2021-01-14 15:32:21
 */
import { KaiheilaEvent } from './kaiheila.type';

export interface UConfig {
  encrypt: false;
  token: string;
}

export interface UConfigEncrypt {
  encrypt: true;
  key: string;
  token: string;
  verifyToken: string;
}

export interface UEventEmitter {
  on: (event: 'raw', listener: (event: KaiheilaEvent) => void) => this;
}

export interface USN {
  [key: number]: number;
}
