<!--
 * @Author: your name
 * @Date: 2021-01-14 15:58:10
 * @LastEditTime: 2021-01-16 00:38:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /uuz.youmukonpaku.com/README.MD
-->
# 白玉楼の幽幽子

> 开黑啦机器人框架，其名为白玉楼の幽幽子。  
> 当前版本号：0.0.1 Development

## 框架说明

```
UUZ
├── src
|   ├── config 配置文件目录
|   |   └── uuz.conf.ts 配置文件
|   ├── framwork 框架主目录
|   |   ├── types 存放框架用types文件
|   |   ├── utils 存放框架用工具函数
|   |   ├── card.ts 卡片类
|   |   ├── index.ts 框架入口
|   |   └── msg.ts 消息处理类
|   ├── handler 处理插件用句柄
|   |   ├── types 存放句柄用types文件
|   |   └── index.ts 句柄入口
|   ├── plugins 插件目录
|   └── index.ts 主程序入口
└── types 存放types相关文件，仅用于存档。
```

## 插件结构

```
import UUZ from '../../framework';
import { TextMessage, Handler } from '../types';

const getChannelId = (data: TextMessage, uuz: UUZ) => {
  uuz.sendGroupMsg.sendTextMsg(data.channelId, `当前频道ID：${data.channelId}`);
};

const commands: any = {
  获取频道id: getChannelId,
};

const handler: Handler = {
  channel: {
    allow: ['*'],
    deny: [],
  },
  enable: true,
  onInit: () => { },
  onRaw: () => { },
  onSystem: () => { },
  onText: ({ data, uuz }) => {
    if (commands[data.content.toLowerCase()]) {
      commands[data.content.toLowerCase()](data, uuz);
    }
  },
  onImage: () => { },
  onVideo: () => { },
  onFile: () => { },
  onAudio: () => { },
  onKMarkdown: () => { },
  onUnknown: () => { },
};

export default handler;
```

## 发送信息

```
import UUZ from '../../framework';

// 处理消息
onText: ({ data, uuz }) => {
  getChannelId(data, uuz);
},

// 发送文字消息
const getChannelId = (data: TextMessage, uuz: UUZ) => {
  uuz.sendGroupMsg.sendTextMsg(data.channelId, `当前频道ID：${data.channelId}`);
};

// 发送KMarkdown消息
const getChannelId = (data: TextMessage, uuz: UUZ) => {
  uuz.sendGroupMsg.sendKmarkdownMsg(data.channelId, `当前频道ID：${data.channelId}`);
};

// 发送卡片消息
import Card from '../../framework/card';

const getChannelId = (data: TextMessage, uuz: UUZ) => {
  uuz.sendGroupMsg.sendCardMsg(data.channelId, [new Card.Card({
    modules: [
      new Card.TitleModule({
        text: {
          type: 'plain-text',
          content: `${data.channelId}`,
        },
      }),
      new Card.ContentModule({
        mode: 'left',
        text: new Card.KmarkdownElement({
          content: `**KmarkdownMessage**`,
        }),
        accessory: new Card.ImageElement({
          src: `{imageUrl}`,
          circle: false,
        }),
      }),
    ],
  })]);
};
```
