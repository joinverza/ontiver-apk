import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

interface HomeBannerSliderProps {
  data: { image: any; onPress: () => void }[];
}

const AUTO_SCROLL_INTERVAL_MS = 2000;
const MANUAL_RESUME_DELAY_MS = 2000;

export const HomeBannerSlider: React.FC<HomeBannerSliderProps> = ({ data }) => {
  const ds = useDesignSystem();
  const [activeSlider, setActiveSlider] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeSliderRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemWidth = ds.width * 0.9;
  const snapInterval = itemWidth + ds.space.lg;

  const clearAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
      autoScrollTimeoutRef.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const setActiveIndex = useCallback((index: number) => {
    const boundedIndex = Math.max(0, Math.min(index, Math.max(data.length - 1, 0)));

    if (activeSliderRef.current !== boundedIndex) {
      activeSliderRef.current = boundedIndex;
      setActiveSlider(boundedIndex);
    }
  }, [data.length]);

  const scrollToBanner = useCallback((index: number, animated = true) => {
    flatListRef.current?.scrollToOffset({
      offset: index * snapInterval,
      animated,
    });
  }, [snapInterval]);

  const scheduleAutoScroll = useCallback((delay = AUTO_SCROLL_INTERVAL_MS) => {
    clearAutoScroll();

    if (data.length <= 1) {
      return;
    }

    autoScrollTimeoutRef.current = setTimeout(() => {
      if (isUserInteractingRef.current) {
        scheduleAutoScroll(MANUAL_RESUME_DELAY_MS);
        return;
      }

      const nextIndex = (activeSliderRef.current + 1) % data.length;
      setActiveIndex(nextIndex);
      scrollToBanner(nextIndex);
      scheduleAutoScroll(AUTO_SCROLL_INTERVAL_MS);
    }, delay);
  }, [clearAutoScroll, data.length, scrollToBanner, setActiveIndex]);

  const updateActiveIndexFromOffset = useCallback((offset: number) => {
    setActiveIndex(Math.round(offset / snapInterval));
  }, [setActiveIndex, snapInterval]);

  const pauseAutoScrollForManualInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    clearAutoScroll();
    clearResumeTimer();
  }, [clearAutoScroll, clearResumeTimer]);

  const resumeAutoScrollAfterManualInteraction = useCallback(() => {
    clearResumeTimer();
    resumeTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
      scheduleAutoScroll(AUTO_SCROLL_INTERVAL_MS);
    }, MANUAL_RESUME_DELAY_MS);
  }, [clearResumeTimer, scheduleAutoScroll]);

  useEffect(() => {
    scheduleAutoScroll();

    return () => {
      clearAutoScroll();
      clearResumeTimer();
    };
  }, [clearAutoScroll, clearResumeTimer, scheduleAutoScroll]);

  return (
    <View style={{ gap: ds.space.lg }}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => {
          const SvgImage = item.image;
          return (
            <TouchableOpacity onPress={item.onPress} style={{ width: itemWidth, borderRadius: ds.space.md, overflow: 'hidden' }}>
              <SvgImage width="100%" height={ds.width * 0.4} />
            </TouchableOpacity>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        onScroll={(e) => {
          updateActiveIndexFromOffset(e.nativeEvent.contentOffset.x);
        }}
        onScrollBeginDrag={pauseAutoScrollForManualInteraction}
        onMomentumScrollBegin={pauseAutoScrollForManualInteraction}
        onScrollEndDrag={(e) => {
          updateActiveIndexFromOffset(e.nativeEvent.contentOffset.x);
          resumeAutoScrollAfterManualInteraction();
        }}
        onMomentumScrollEnd={(e) => {
          updateActiveIndexFromOffset(e.nativeEvent.contentOffset.x);
          resumeAutoScrollAfterManualInteraction();
        }}
        scrollEventThrottle={16}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: ds.space.xs }}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeSlider ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === activeSlider ? Colors.mainText : 'rgba(225, 225, 225, 1)',
            }}
          />
        ))}
      </View>
    </View>
  );
};
