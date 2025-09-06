// import * as Slot from '@rn-primitives/slot';
// import type { SlottableTextProps, TextRef } from '@rn-primitives/types';
// import * as React from 'react';
// import { Text as RNText } from 'react-native';
// import { cn } from '~/lib/utils';

// const TextClassContext = React.createContext<string | undefined>(undefined);

// const weightToFont: Record<string, string> = {
//   'font-bold': 'Poppins-Bold',
//   'font-semibold': 'Poppins-SemiBold',
//   'font-normal': 'Poppins-Regular',
// };

// const Text = React.forwardRef<TextRef, SlottableTextProps>(
//   ({ className = '', asChild = false, style, ...props }, ref) => {
//     const textClass = React.useContext(TextClassContext);
//     const Component = asChild ? Slot.Text : RNText;

//     // figure out which font weight is present
//     const matchedWeight = Object.keys(weightToFont).find(w =>
//       className?.includes(w),
//     );

//     const fontFamily = matchedWeight
//       ? weightToFont[matchedWeight]
//       : 'Poppins-Regular'; // default

//     return (
//       <Component
//         className={cn(
//           'text-base text-foreground web:select-text',
//           textClass,
//           className,
//         )}
//         style={[{ fontFamily }, style]}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );

// Text.displayName = 'Text';

// export { Text, TextClassContext };

import * as Slot from '@rn-primitives/slot';
import type { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '~/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

// Map tailwind weight classes to your loaded Poppins faces
const weightToFont: Record<'bold' | 'semibold' | 'normal', string> = {
  bold: 'Poppins-Bold',
  semibold: 'Poppins-SemiBold',
  normal: 'Poppins-Regular',
};

// Extract font weight class from a class string (exact match)
function resolveFontFromClasses(allClasses: string): string {
  if (allClasses.includes('font-poppins-bold')) return 'Poppins-Bold';
  if (allClasses.includes('font-poppins-semibold')) return 'Poppins-SemiBold';
  const match = allClasses.match(
    /(?:^|\s)font-(bold|semibold|medium|normal)(?=\s|$)/,
  );
  if (!match) return 'Poppins-Regular';
  return (
    weightToFont[match[1] as keyof typeof weightToFont] ?? 'Poppins-Regular'
  );
}

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className = '', asChild = false, style, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    // Build the final class list FIRST
    const mergedClasses = cn(
      'text-base text-foreground web:select-text',
      textClass,
      className,
    );

    // Decide which Poppins face to use from the merged classes
    const fontFamily = resolveFontFromClasses(mergedClasses);

    return (
      <Component
        className={mergedClasses}
        // Put your fontFamily LAST so it overrides any earlier style merges
        style={[style, { fontFamily }]}
        ref={ref}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';

export { Text, TextClassContext };
