import React, {useRef, useState, useEffect} from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


const Loader = () => {
    
  let animation = useRef(new Animated.Value(0));
  const [progress, setProgress] = useState(0);
  useInterval(() => {
    if(progress < 100) {
      setProgress(progress + 50);
    }
  }, 550);

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 100
    }).start();
  },[progress])

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "95%"],
    extrapolate: "clamp"
  })
  return (
    <View style={styles.container}>
      {/* <Text>
        Loading…..
      </Text> */}
      <View style={styles.progressBar}>
        <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#900000", width }}/>
      </View>
      {/* <Text>
        {`${progress}%`}
      </Text> */}

    </View>
  );
}

export default Loader;

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    height: 5,
    width: '100%',
    backgroundColor: 'rgba(144,0,0,0.3)',
    borderColor: '#000',
  }
});
