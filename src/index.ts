/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 11:38:01
 * @LastEditTime: 2021-01-14 15:57:42
 */
import UUZ from './framework';
import handler from './handler';

import config from './config/uuz.conf';

const uuz = new UUZ(config);

handler(uuz);

uuz.listen(3000);

// eslint-disable-next-line
console.log('Listening on port 3000');
