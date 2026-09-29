import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppColors from '../constants/colors';
import buttonStyles from '../constants/buttonStyles';
import Images from '../assets/images';
import { loginApi } from '../api/loginApi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/CustomSnackbar';
import LoadingDialog from '../components/LoadingDialog';

export const LoginView = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ mobile?: string; password?: string }>({});

  const { saveUserSession } = useAuth();
  const { successSnackBar, infoSnackBar, errorSnackBar } = useSnackbar();

  const validate = () => {
    const newErrors: { mobile?: string; password?: string } = {};
    const trimmedMobile = mobileNumber.trim();
    if (!trimmedMobile) {
      newErrors.mobile = 'Enter Mobile Number';
    } else if (trimmedMobile.length !== 10) {
      newErrors.mobile = 'Mobile number should be in 10 digits';
    }

    if (!password.trim()) {
      newErrors.password = 'Please input a password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await loginApi.getLogin(mobileNumber.trim(), password.trim());
      setLoading(false);

      if (response.response === 'ok' && response.userData) {
        await saveUserSession(response.userData);
        successSnackBar('Success', 'Login successfully done');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else if (response.response === 'invalid Mobile Number!') {
        infoSnackBar('Invalid credentials', 'Invalid mobile number');
      } else if (response.response === 'invalid Password!') {
        infoSnackBar('Invalid Password', 'Invalid password');
      } else {
        errorSnackBar('Login failed', 'Server down, please try again later');
      }
    } catch (e) {
      setLoading(false);
      errorSnackBar('Login failed', 'Network error or server down');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Background decorations */}
        <Image source={Images.blutop} style={styles.topCurve} resizeMode="contain" />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>LOGIN    </Text>
        </View>
        <Image source={Images.bluedwn} style={styles.bottomCurve} resizeMode="contain" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <Image source={Images.icon} style={styles.logo} resizeMode="contain" />
              <View style={{ height: 30 }} />

              {/* Mobile Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>   Enter Mobile</Text>
                <TextInput
                  style={[styles.input, errors.mobile ? styles.inputErrorBorder : null]}
                  placeholder="Enter Mobile"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={text => {
                    setMobileNumber(text.replace(/[^0-9]/g, ''));
                    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                  }}
                />
                {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
              </View>

              <View style={{ height: 15 }} />

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>   Enter Password</Text>
                <TextInput
                  style={[styles.input, errors.password ? styles.inputErrorBorder : null]}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <View style={{ height: 30 }} />

              {/* Login Button */}
              <TouchableOpacity
                style={buttonStyles.curveButtonStyleThemeColor}
                onPress={handleLogin}
                activeOpacity={0.8}>
                <Text style={buttonStyles.buttonTextWhite}>LOGIN</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />

              {/* Register Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.registerLink}
                activeOpacity={0.7}>
                <Text style={styles.registerText}>Don't have account?  Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <LoadingDialog visible={loading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  topCurve: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 140,
    height: 140,
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    top: 14,
    right: 0,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: AppColors.themeColor,
  },
  bottomCurve: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 140,
    height: 140,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
    zIndex: 3,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
  },
  inputWrapper: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    color: AppColors.themeColorLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: AppColors.themeColorLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: AppColors.black,
    backgroundColor: AppColors.white,
  },
  inputErrorBorder: {
    borderColor: AppColors.redAccent,
  },
  errorText: {
    color: AppColors.redAccent,
    fontSize: 11,
    marginTop: 3,
    marginLeft: 4,
  },
  registerLink: {
    padding: 12,
  },
  registerText: {
    color: AppColors.black,
    fontSize: 14,
  },
});

export default LoginView;
