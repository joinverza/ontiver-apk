import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { BodySmallText } from '../components/shared/AppTexts';
import { useDesignSystem } from '../utils/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets();
  
  const [toastConfig, setToastConfig] = useState<ToastOptions | null>(null);
  const translateY = useSharedValue(-150); // Start off-screen
  
  const TOAST_WIDTH = width * 0.7; // 70% of screen width

  const hideToast = useCallback(() => {
    translateY.value = withTiming(-150, { duration: 300 }, () => {
      runOnJS(setToastConfig)(null);
    });
  }, [translateY]);

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    setToastConfig({ message, type, duration });
    // Slide in from top
    translateY.value = withSpring(insets.top + ds.space.md, {
      damping: 15,
      stiffness: 100,
    });

    if (duration > 0) {
      setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, [ds.space.md, hideToast, insets.top, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const getBackgroundColor = (type?: ToastType) => {
    switch (type) {
      case 'success': return Colors.positive;
      case 'error': return Colors.error;
      case 'warning': return Colors.warning;
      case 'info':
      default: return Colors.informational;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastConfig && (
        <Animated.View
          style={[
            styles.toastContainer,
            animatedStyle,
            {
              width: TOAST_WIDTH,
              backgroundColor: getBackgroundColor(toastConfig.type),
              borderRadius: ds.radius.md,
              padding: ds.space.md,
              right: ds.space.md, // position top-right
            },
          ]}
        >
          <View style={styles.contentContainer}>
            <BodySmallText color={Colors.white} style={styles.message}>
              {toastConfig.message}
            </BodySmallText>
            <TouchableOpacity onPress={hideToast} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0, // translateY handles the actual vertical position
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    marginRight: 8,
  },
});
