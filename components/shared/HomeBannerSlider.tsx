import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

interface HomeBannerSliderProps {
  data: { image: any; onPress: () => void }[];
}

export const HomeBannerSlider: React.FC<HomeBannerSliderProps> = ({ data }) => {
  const ds = useDesignSystem();
  const [activeSlider, setActiveSlider] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlider((prevActiveSlider) => {
        let nextIndex = prevActiveSlider + 1;
        if (nextIndex >= data.length) {
          nextIndex = 0;
        }
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * (ds.width * 0.9 + ds.space.lg),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length, ds.width, ds.space.lg]);

  return (
    <View style={{ gap: ds.space.lg }}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => {
          const SvgImage = item.image;
          return (
            <TouchableOpacity onPress={item.onPress} style={{ width: ds.width * 0.9, borderRadius: ds.space.md, overflow: 'hidden' }}>
              <SvgImage width="100%" height={ds.width * 0.4} />
            </TouchableOpacity>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
        snapToInterval={ds.width * 0.9 + ds.space.lg}
        decelerationRate="fast"
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (ds.width * 0.9 + ds.space.lg));
          setActiveSlider(index);
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
