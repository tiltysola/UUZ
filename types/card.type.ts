/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-14 17:37:29
 * @LastEditTime: 2021-01-14 18:02:24
 */
export interface Card {
  type: 'card';
  theme?: 'primary' | 'warning' | 'danger' | 'info' | string;
  size?: 'sm' | 'lg';
  color?: string;
  modules: Array<TitleModule | ContentModule | ImageModule | ActionModule | ContentModule | DividerModule | FileModule | CountdownModule>;
}

export interface TitleModule {
  type: 'header';
  text: {
    type: 'plain-text';
    content: string;
  };
}

export interface ContentModule {
  type: 'section';
  mode?: 'left' | 'right';
  text: TextElement | KmarkdownElement | ParagraphStruct;
  accessory?: ImageElement | ButtonElement;
}

export interface ImageModule {
  type: 'image-group';
  elements: ImageElement[];
}

export interface ActionModule {
  type: 'action-group';
  elements: ButtonElement[];
}

export interface ContextModule {
  type: 'context';
  elements: Array<TextElement | KmarkdownElement | ImageElement>;
}

export interface DividerModule {
  type: 'divider';
}

export interface FileModule {
  type: 'file' | 'audio' | 'video';
  src: string;
  title: string;
  cover?: string;
}

export interface CountdownModule {
  type: 'countdown';
  endTime: number;
  startTime: number;
  mode: 'day' | 'hour' | 'second';
}

export interface TextElement {
  type: 'plain-text';
  content: string;
  emoji?: boolean;
}

export interface KmarkdownElement {
  type: 'kmarkdown';
  content: string;
}

export interface ImageElement {
  type: 'image';
  src: string;
  alt?: string;
  size?: 'sm' | 'lg';
  circle?: boolean;
}

export interface ButtonElement {
  type: 'button';
  theme?: 'primary' | 'warning' | 'danger' | 'info' | string;
  value: string;
  click: 'link' | 'return-val';
  text: string;
}

export interface ParagraphStruct {
  type: 'paragraph';
  cols: number;
  fields: Array<TextElement | KmarkdownElement | ContextModule>;
}
