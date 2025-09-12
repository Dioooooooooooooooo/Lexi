import { arrange, bubble, choice } from './bubble';
import { MessageTypeEnum } from './enum';

export type Message = {
  id: number;
  type: MessageTypeEnum;
  payload: bubble | choice | arrange;
};
