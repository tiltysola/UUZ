/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-15 11:16:48
 * @LastEditTime: 2021-01-15 11:57:04
 */
import {
  Card as CardType,
  TitleModule as TitleModuleType,
  ContentModule as ContentModuleType,
  ImageModule as ImageModuleType,
  ActionModule as ActionModuleType,
  ContextModule as ContextModuleType,
  DividerModule as DividerModuleType,
  FileModule as FileModuleType,
  CountdownModule as CountdownModuleType,
  TextElement as TextElementType,
  KmarkdownElement as KmarkdownElementType,
  ParagraphStruct as ParagraphStructType,
  ImageElement as ImageElementType,
  ButtonElement as ButtonElementType,
} from './types/card.type';

class Card implements CardType {
  type: 'card' = 'card';
  theme?: string | undefined;
  size?: 'sm' | 'lg' | undefined;
  color?: string | undefined;
  modules: Array<TitleModuleType | ContentModuleType | ImageModuleType | ActionModuleType | ContextModuleType | DividerModuleType | FileModuleType | CountdownModuleType> = [];

  constructor(card: CardType) {
    Object.assign(this, card);
  }
}

class TitleModule implements TitleModuleType {
  type: 'header' = 'header';
  text: {
    type: 'plain-text';
    content: string;
  } = {
    type: 'plain-text',
    content: '',
  };

  constructor(titleModule: TitleModuleType) {
    Object.assign(this, titleModule);
  }
}

class ContentModule implements ContentModuleType {
  type: 'section' = 'section';
  mode?: 'left' | 'right';
  text: TextElementType | KmarkdownElementType | ParagraphStructType = {
    type: 'plain-text',
    content: '',
  };
  accessory?: ImageElementType | ButtonElementType;

  constructor(contentModule: ContentModuleType) {
    Object.assign(this, contentModule);
  }
}

class ImageModule implements ImageModuleType {
  type: 'image-group' = 'image-group';
  elements: ImageElementType[] = [];

  constructor(contentModule: ContentModuleType) {
    Object.assign(this, contentModule);
  }
}

class ActionModule implements ActionModuleType {
  type: 'action-group' = 'action-group';
  elements: ButtonElementType[] = [];

  constructor(actionModule: ActionModuleType) {
    Object.assign(this, actionModule);
  }
}

class ContextModule implements ContextModuleType {
  type: 'context' = 'context';
  elements: Array<TextElementType | KmarkdownElementType | ImageElementType> = [];

  constructor(contnxtModule: ContextModuleType) {
    Object.assign(this, contnxtModule);
  }
}

class DividerModule implements DividerModuleType {
  type: 'divider' = 'divider';

  constructor(dividerModule: DividerModuleType) {
    Object.assign(this, dividerModule);
  }
}

class FileModule implements FileModuleType {
  type: 'file' | 'audio' | 'video' = 'file';
  src = '';
  title = '';
  cover?: string;

  constructor(fileModule: FileModuleType) {
    Object.assign(this, fileModule);
  }
}

class CountdownModule implements CountdownModuleType {
  type: 'countdown' = 'countdown';
  endTime = 0;
  startTime = 0;
  mode: 'day' | 'hour' | 'second' = 'day';

  constructor(countdownModule: CountdownModuleType) {
    Object.assign(this, countdownModule);
  }
}

class TextElement implements TextElementType {
  type: 'plain-text' = 'plain-text';
  content = '';
  emoji?: boolean;

  constructor(textElement: TextElementType) {
    Object.assign(this, textElement);
  }
}

class KmarkdownElement implements KmarkdownElementType {
  type: 'kmarkdown' = 'kmarkdown';
  content = '';

  constructor(kmarkdownElement: KmarkdownElementType) {
    Object.assign(this, kmarkdownElement);
  }
}

class ImageElement implements ImageElementType {
  type: 'image' = 'image';
  src = '';
  alt?: string;
  size?: 'sm' | 'lg';
  circle?: boolean;

  constructor(imageElement: ImageElementType) {
    Object.assign(this, imageElement);
  }
}

class ButtonElement implements ButtonElementType {
  type: 'button' = 'button';
  theme?: 'primary' | 'warning' | 'danger' | 'info' | string;
  value = '';
  click: 'link' | 'return-val' = 'return-val';
  text = '';

  constructor(buttonElement: ButtonElementType) {
    Object.assign(this, buttonElement);
  }
}

class ParagraphStruct implements ParagraphStructType {
  type: 'paragraph' = 'paragraph';
  cols = 2;
  fields: Array<TextElementType | TextElementType | TextElementType> = [];

  constructor(paragraphStruct: ParagraphStructType) {
    Object.assign(this, paragraphStruct);
  }
}

export default {
  Card, TitleModule, ContentModule, ImageModule, ActionModule, ContextModule, DividerModule, FileModule, CountdownModule, TextElement, KmarkdownElement, ImageElement, ButtonElement, ParagraphStruct,
};
