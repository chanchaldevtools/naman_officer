import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-nitro-sound';
import AppColors from '../constants/colors';
import buttonStyles from '../constants/buttonStyles';
import CustomAppBar from '../components/CustomAppBar';
import Images from '../assets/images';

export const AudioPlayView = ({ route, navigation }: any) => {
  const { audioUrl } = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('Play');

  const playerRef = useRef<any>(null);

  useEffect(() => {
    playerRef.current = new (AudioRecorderPlayer as any)();
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.stopPlayer();
        } catch (e) {
          // ignore cleanup
        }
      }
    };
  }, []);

  const handlePlayToggle = async () => {
    if (!audioUrl) return;

    if (isPlaying) {
      try {
        await playerRef.current?.stopPlayer();
        playerRef.current?.removePlayBackListener();
        setIsPlaying(false);
        setButtonText('Play');
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        setIsPlaying(true);
        await playerRef.current?.startPlayer(audioUrl);
        playerRef.current?.addPlayBackListener((e: any) => {
          if (e.currentPosition >= e.duration) {
            playerRef.current?.stopPlayer();
            playerRef.current?.removePlayBackListener();
            setIsPlaying(false);
            setButtonText('Play Again');
          }
        });
      } catch (e) {
        setIsPlaying(false);
        console.error(e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomAppBar title="Audio Record" onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={{ height: 40 }} />
        {isPlaying ? (
          <Image source={Images.recGif} style={styles.recordImage} resizeMode="contain" />
        ) : (
          <Image source={Images.rec} style={styles.recordImage} resizeMode="contain" />
        )}

        <View style={{ height: 25 }} />

        <Text style={styles.statusText}>
          {isPlaying ? 'Playback in progress' : 'Tap to listen the audio'}
        </Text>

        <View style={{ height: 20 }} />

        <TouchableOpacity
          style={buttonStyles.curveButtonStyleThemeColor}
          onPress={handlePlayToggle}
          activeOpacity={0.8}>
          <Text style={buttonStyles.buttonTextWhite}>
            {isPlaying ? 'Stop' : buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  recordImage: {
    width: 140,
    height: 140,
  },
  statusText: {
    fontSize: 14,
    color: AppColors.black,
    fontWeight: '500',
  },
});

export default AudioPlayView;
