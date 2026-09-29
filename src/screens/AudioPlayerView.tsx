import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import AudioRecorderPlayer from 'react-native-nitro-sound';

import AppColors from '../constants/colors';
import buttonStyles from '../constants/buttonStyles';
import CustomAppBar from '../components/CustomAppBar';
import Images from '../assets/images';
import {useAuth} from '../context/AuthContext';
import {helpApi} from '../api/helpApi';
import {useSnackbar} from '../components/CustomSnackbar';
import LoadingDialog from '../components/LoadingDialog';

export const AudioPlayerView = ({navigation}: any) => {
  const {userId, userData} = useAuth();
  const {successSnackBar, errorSnackBar, infoSnackBar} = useSnackbar();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedPath, setRecordedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const recorderRef = useRef<any>(null);

  useEffect(() => {
    recorderRef.current = new (AudioRecorderPlayer as any)();

    return () => {
      if (recorderRef.current) {
        try {
          recorderRef.current.stopRecorder();
          recorderRef.current.stopPlayer();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        return (
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }

    return true;
  };

  const handleStartRecording = async () => {
    const hasPermission = await requestAudioPermission();

    if (!hasPermission) {
      infoSnackBar(
        'Permission Required',
        'Microphone permission is required to record voice',
      );
      return;
    }

    try {
      setIsRecording(true);

      const result = await recorderRef.current?.startRecorder();

      recorderRef.current?.addRecordBackListener((_e: any) => {
        return;
      });

      if (result) {
        setRecordedPath(result);
      }
    } catch (e) {
      setIsRecording(false);
      console.error('startRecorder error:', e);
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await recorderRef.current?.stopRecorder();

      recorderRef.current?.removeRecordBackListener();

      setIsRecording(false);

      if (result) {
        setRecordedPath(result);
      }
    } catch (e) {
      setIsRecording(false);
      console.error('stopRecorder error:', e);
    }
  };

  const handleStartPlaying = async () => {
    if (!recordedPath) {
      return;
    }

    try {
      setIsPlaying(true);

      await recorderRef.current?.startPlayer(recordedPath);

      recorderRef.current?.addPlayBackListener((e: any) => {
        if (e.currentPosition >= e.duration) {
          handleStopPlaying();
        }
      });
    } catch (e) {
      setIsPlaying(false);
      console.error('startPlayer error:', e);
    }
  };

  const handleStopPlaying = async () => {
    try {
      await recorderRef.current?.stopPlayer();

      recorderRef.current?.removePlayBackListener();

      setIsPlaying(false);
    } catch (e) {
      setIsPlaying(false);
      console.error('stopPlayer error:', e);
    }
  };

  const handleSubmitAudioHelp = async () => {
    if (!recordedPath) {
      infoSnackBar(
        'No Recording',
        'Please record your voice before submitting',
      );
      return;
    }

    setLoading(true);

    try {
      const response = await helpApi.sendAudioHelpRequest(
        String(userId),
        String(userData?.policeStationId || '1'),
        'Audio',
        recordedPath,
      );

      setLoading(false);

      if (response && response.response === 'ok') {
        successSnackBar(
          'Help Request send to the Police station',
          '',
        );

        navigation.goBack();
      } else {
        errorSnackBar(
          'Unable to send help request',
          'Server down, please try again later',
        );
      }
    } catch (e) {
      setLoading(false);

      errorSnackBar(
        'Error',
        'Unable to send voice help request',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomAppBar
        title="Record your voice"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {isRecording ? (
          <Image
            source={Images.recGif}
            style={styles.recordImage}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={Images.rec}
            style={styles.recordImage}
            resizeMode="contain"
          />
        )}

        <View style={{height: 20}} />

        {isRecording ? (
          <View style={styles.recordingRow}>
            <Text style={styles.recordingStatusText}>
              Recording..
            </Text>

            <Image
              source={Images.blinkDot}
              style={styles.blinkDot}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text style={styles.stoppedStatusText}>
            {recordedPath
              ? 'Recording complete'
              : 'Recorder is stopped'}
          </Text>
        )}

        <View style={{height: 20}} />

        <TouchableOpacity
          style={buttonStyles.elevatedCurveButtonStyleWhite}
          onPress={
            isRecording
              ? handleStopRecording
              : handleStartRecording
          }
          activeOpacity={0.8}>
          <Text
            style={[
              styles.buttonLabel,
              {
                color: isRecording
                  ? AppColors.redAccent
                  : AppColors.themeColor,
              },
            ]}>
            {isRecording
              ? '⏹ Stop Recording'
              : '🎙 Start Recording'}
          </Text>
        </TouchableOpacity>

        <View style={{height: 16}} />

        {!isRecording && recordedPath ? (
          <TouchableOpacity
            style={buttonStyles.elevatedCurveButtonStyleWhite}
            onPress={
              isPlaying
                ? handleStopPlaying
                : handleStartPlaying
            }
            activeOpacity={0.8}>
            <Text
              style={[
                styles.buttonLabel,
                {
                  color: isPlaying
                    ? AppColors.redAccent
                    : AppColors.themeColor,
                },
              ]}>
              {isPlaying
                ? '⏹ Stop Playing'
                : '▶ Start Playing'}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={{height: 35}} />

        {!isRecording && recordedPath ? (
          <TouchableOpacity
            style={buttonStyles.curveButtonStyleThemeColor}
            onPress={handleSubmitAudioHelp}
            activeOpacity={0.8}>
            <Text style={buttonStyles.buttonTextWhite}>
              Submit
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={{height: 16}} />

        <Text style={styles.hintText}>
          {isRecording
            ? 'Tap on stop recording after completing your voice message'
            : 'Tap on start recording button and record your voice'}
        </Text>
      </View>

      <LoadingDialog
        visible={loading}
        message="Sending voice help.."
      />
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
    paddingTop: 36,
    paddingHorizontal: 24,
  },

  recordImage: {
    width: 140,
    height: 140,
  },

  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordingStatusText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppColors.redAccent,
  },

  blinkDot: {
    width: 24,
    height: 24,
    marginLeft: 6,
  },

  stoppedStatusText: {
    fontSize: 14,
    color: '#4B5563',
  },

  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  hintText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AudioPlayerView;