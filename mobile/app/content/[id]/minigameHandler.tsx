import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function minigameProvider() {
  const _randomMinigames = [
    {
      id: '22cf81de-ad40-488a-84cc-9f90ee5224ff',
      minigameType: 'TwoTruthsOneLie',
      metaData:
        '{"choices": ["choice": "The webs were kissed by the quiet sunbeam.","answer": true},{"choice": "A spider\'s web looks like a jeweled chain.","answer": true},{"choice": "The spiders\' webs were created by the fog.","answer": false}],  "explanation": "The passage mentions that mist strung the webs with pearls, not fog."}',
      maxScore: 1,
    },
    {},
  ];
}

const minigameHandler = () => {
  return <View></View>;
};

export default minigameHandler;
