import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Message } from '@/types/message';
import { MessageTypeEnum } from '@/types/enum';
import { arrange, choice } from '@/types/bubble';

const _randomMinigames = {
  message: 'Random minigames successfully fetched',
  data: [
    {
      id: 'f7d5ea1d-eb62-4808-86ac-93cde6615bb5',
      reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
      minigame_type: 1,
      part_num: 1,
      metadata: {
        reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
        part_num: 1,
        question: 'What did the family decide to sell in order to buy salt?',
        choices: [
          { choice: 'Their goat', answer: true },
          { choice: 'Their land', answer: false },
          { choice: 'Their cow', answer: false },
        ],
        explanation:
          'The family sold their goat to buy salt for retail selling.',
      },
      max_score: 1,
      created_at: '2025-09-06T12:26:18.705Z',
    },
    {
      id: '10d084d5-e705-4971-af89-426cf9215455',
      reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
      minigame_type: 0,
      part_num: 2,
      metadata: {
        reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
        part_num: 2,
        correct_answer: [
          'The boy hoped',
          'to buy new clothes',
          'after selling the salt',
        ],
        parts: [
          'after selling the salt',
          'The boy hoped',
          'to buy new clothes',
        ],
        explanation:
          'Before the second minigame, the boy wished to use earnings to buy clothes.',
      },
      max_score: 1,
      created_at: '2025-09-06T12:24:04.219Z',
    },
    {
      id: 'b54a495c-7517-4ef9-b9ff-16018a3ef553',
      reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
      minigame_type: 0,
      part_num: 3,
      metadata: {
        reading_material_id: '5a99687c-bb2a-44d2-9060-d3fcb66dee35',
        part_num: 3,
        correct_answer: [
          'The boy slipped in the rain',
          'helped the old man',
          'and lost his salt packs',
        ],
        parts: [
          'helped the old man',
          'The boy slipped in the rain',
          'and lost his salt packs',
        ],
        explanation:
          'Before the third minigame, the boy lost his salt in the rain but still helped the old man.',
      },
      max_score: 1,
      created_at: '2025-09-06T12:24:44.787Z',
    },
  ],
};

export function minigameProvider(minigameCount: number, bubbleCount: number) {
  // temp type:1 = choices, 0: arrangement
  console.log('woah', minigameCount);
  const minigame = _randomMinigames.data[minigameCount];

  // CHOICES
  if (minigame.minigame_type === 1) {
    const choicesBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.CHOICES,
      payload: minigame.metadata! as choice,
    };
    return choicesBubble;
  } else if (minigame.minigame_type === 0) {
    const arrangeBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.ARRANGE,
      payload: minigame.metadata as arrange,
    };
    return arrangeBubble;
  }
}

const minigameHandler = () => {
  return <View></View>;
};

export default minigameHandler;
