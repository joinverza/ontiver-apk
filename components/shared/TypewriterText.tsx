import React, { useState, useEffect } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface Props {
  text: string;
  isActive: boolean;
  style?: StyleProp<TextStyle>;
  typingSpeed?: number;
}

export function TypewriterText({ text, isActive, style, typingSpeed = 35 }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    // If it hasn't typed yet, and it becomes active, start typing.
    if (isActive && !hasTyped) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setHasTyped(true);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    } else if (!hasTyped) {
      // Keep it empty until active
      setDisplayedText('');
    }
  }, [isActive, text, typingSpeed, hasTyped]);

  return <Text style={style}>{displayedText}</Text>;
}
