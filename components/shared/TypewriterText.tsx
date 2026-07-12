import React, { useEffect, useMemo, useCallback } from 'react';
import { TextStyle, StyleProp, View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming, 
  withDelay,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  Easing,
  SharedValue,
  runOnJS
} from 'react-native-reanimated';

export type TextSegment = {
  text: string;
  bold?: boolean;
};

interface Props {
  text?: string;
  segments?: TextSegment[];
  isActive: boolean;
  style?: StyleProp<TextStyle>;
  typingSpeed?: number;
  enterDelay?: number;
  exitSpeed?: number;
  maxExitDuration?: number;
  onExitComplete?: () => void;
  onTypeComplete?: () => void;
}

/**
 * TypewriterText with fade-in entrance and reverse fade-out exit.
 * 
 * - When `isActive` becomes true: characters fade in left-to-right (typewriter in)
 * - When `isActive` becomes false: characters fade out right-to-left (typewriter out)
 * - `onExitComplete` fires after the exit animation finishes
 */
export function TypewriterText({
  text,
  segments,
  isActive,
  style,
  typingSpeed = 14,
  enterDelay = 80,
  exitSpeed = 7,
  maxExitDuration = 220,
  onExitComplete,
  onTypeComplete
}: Props) {
  // progress: 0 = all hidden, totalLength = all visible
  const progress = useSharedValue(0);

  const charArray = useMemo(() => {
    const arr: { char: string; bold: boolean }[] = [];
    if (segments) {
      segments.forEach(seg => {
        for (let i = 0; i < seg.text.length; i++) {
          arr.push({ char: seg.text[i], bold: !!seg.bold });
        }
      });
    } else if (text) {
      for (let i = 0; i < text.length; i++) {
        arr.push({ char: text[i], bold: false });
      }
    }
    return arr;
  }, [text, segments]);

  const totalLength = charArray.length;

  const notifyExitComplete = useCallback(() => {
    onExitComplete?.();
  }, [onExitComplete]);

  const notifyTypeComplete = useCallback(() => {
    onTypeComplete?.();
  }, [onTypeComplete]);

  useEffect(() => {
    if (isActive && totalLength > 0) {
      // Type IN: smooth entrance with a gentle ramp
      progress.value = 0;
      progress.value = withDelay(
        enterDelay,
        withTiming(totalLength, {
          duration: totalLength * typingSpeed,
          easing: Easing.out(Easing.quad)
        }, (finished) => {
          if (finished && onTypeComplete) {
            runOnJS(notifyTypeComplete)();
          }
        })
      );
    } else if (!isActive && totalLength > 0) {
      // Type OUT: quick, smooth reverse fade
      progress.value = withTiming(0, {
        duration: Math.min(totalLength * exitSpeed, maxExitDuration),
        easing: Easing.in(Easing.quad)
      }, (finished) => {
        if (finished && onExitComplete) {
          runOnJS(notifyExitComplete)();
        }
      });
    }
  }, [enterDelay, exitSpeed, isActive, maxExitDuration, notifyExitComplete, notifyTypeComplete, onExitComplete, onTypeComplete, totalLength, typingSpeed]);

  // Group characters into words and lines
  const linesParsed = useMemo(() => {
    const lines: { words: { chars: { char: string; bold: boolean }[] }[] }[] = [];
    let currentLine = { words: [] as any[] };
    let currentWord = { chars: [] as any[] };

    charArray.forEach((c) => {
      if (c.char === '\n') {
        if (currentWord.chars.length > 0) {
          currentLine.words.push(currentWord);
        }
        lines.push(currentLine);
        currentLine = { words: [] };
        currentWord = { chars: [] };
      } else if (c.char === ' ') {
        currentWord.chars.push(c);
        currentLine.words.push(currentWord);
        currentWord = { chars: [] };
      } else {
        currentWord.chars.push(c);
      }
    });

    if (currentWord.chars.length > 0) currentLine.words.push(currentWord);
    if (currentLine.words.length > 0) lines.push(currentLine);

    return lines;
  }, [charArray]);

  let globalCharIndex = 0;

  const flattenedStyle = StyleSheet.flatten(style || {});
  const { 
    marginBottom, marginTop, marginLeft, marginRight, marginVertical, marginHorizontal, margin, 
    ...textStyles 
  } = flattenedStyle as any;

  const containerStyle = { marginBottom, marginTop, marginLeft, marginRight, marginVertical, marginHorizontal, margin };

  return (
    <View style={[{ flexDirection: 'column' }, containerStyle]}>
      {linesParsed.map((line, lineIndex) => (
        <View key={lineIndex} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {line.words.map((word, wordIndex) => (
             <View key={wordIndex} style={{ flexDirection: 'row' }}>
               {word.chars.map((c, charIndex) => {
                 const currentIndex = globalCharIndex++;
                 return (
                   <AnimatedChar 
                     key={currentIndex} 
                     char={c.char} 
                     index={currentIndex} 
                     progress={progress} 
                     textStyle={[
                       textStyles, 
                       c.bold && { fontFamily: 'Inter_800ExtraBold' },
                       !c.bold && { fontFamily: 'Inter_400Regular' }
                     ]}
                   />
                 );
               })}
             </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const AnimatedChar = React.memo(({ char, index, progress, textStyle }: { char: string, index: number, progress: SharedValue<number>, textStyle: StyleProp<TextStyle> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [index, index + 3],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <Animated.Text style={[textStyle, { opacity: 0 }, animatedStyle]}>
      {char}
    </Animated.Text>
  );
});
