import { View } from 'react-native';
import { type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
    const scaleImage = useSharedValue(imageSize);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const angle = useSharedValue(0);
    const startAngle = useSharedValue(0);

    const rotation = Gesture.Rotation()
    .onStart(() => {
      startAngle.value = angle.value;
    })
    .onUpdate((event) => {
      angle.value = startAngle.value + event.rotation;
    });

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}rad` }],
  }));


    const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if(scaleImage.value === imageSize) {
        scaleImage.value = imageSize * 2;
    } else if (scaleImage.value === imageSize * 2) {
        scaleImage.value = imageSize * 3;
    } else {
        scaleImage.value = imageSize;
    }
});
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    } 
}
);
  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  
  return (
<GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
          <GestureDetector gesture={doubleTap}>
            <GestureDetector gesture={rotation}>
                <Animated.Image
                  source={stickerSource}
                  resizeMode="contain"
                  style={[imageStyle, { width: imageSize, height: imageSize }, boxAnimatedStyles]}
                  />
            </GestureDetector>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
