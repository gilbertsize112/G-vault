import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSplashActive, setIsSplashActive] = useState(true); // Control the 5s transition
  const router = useRouter();

  // --- ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(30)).current; 
  const logoScale = useRef(new Animated.Value(0)).current; 
  const splashFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Timer for the 5-second Splash transition
    const timer = setTimeout(() => {
      // Fade out splash
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashActive(false);
        // Start Login Form animations after splash is gone
        startLoginAnimations();
      });
    }, 5000); // 5 Seconds

    return () => clearTimeout(timer);
  }, []);

  const startLoginAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Please enter your credentials.");
    } else {
      router.replace('/home'); 
    }
  };

  // --- SPLASH SCREEN VIEW ---
  if (isSplashActive) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashFade }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.splashContent}>
          <View style={styles.splashLogoCircle}>
             <Text style={styles.splashLogoIcon}>₦</Text>
          </View>
          <Text style={styles.splashTitle}>Welcome to G Vault</Text>
          <Text style={styles.splashLicense}>Licensed by Gilbert</Text>
        </View>
      </Animated.View>
    );
  }

  // --- LOGIN SCREEN VIEW ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inner}>
            
            <Animated.View 
              style={[
                styles.formCard, 
                { 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.logoCircle, { transform: [{ scale: logoScale }] }]}>
                  <Text style={styles.logoText}>₦</Text>
                </Animated.View>
                <Text style={styles.header}>G-Vault Secure</Text>
                <Text style={styles.subHeader}>Manage your wealth securely</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="investor@example.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true} 
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.button} 
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Link to SignUp Page */}
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.secondaryButtonText}>Create New Account</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.footerText}>© 2025 G-Vault Fintech Africa</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Splash Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#0052FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 999,
  },
  splashContent: { alignItems: 'center' },
  splashLogoCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 30, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  splashLogoIcon: { color: '#FFF', fontSize: 50, fontWeight: 'bold' },
  splashTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  splashLicense: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 10, fontWeight: '500' },

  // Login Styles
  container: { flex: 1, backgroundColor: '#020617' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  inner: { padding: 24, alignItems: 'center', width: '100%' },
  formCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 32, 
    borderRadius: 32, 
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10 
  },
  logoContainer: { alignItems: 'center', marginBottom: 35 },
  logoCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 22, 
    backgroundColor: '#0052FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
    shadowColor: '#0052FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  logoText: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  header: { fontSize: 26, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
  subHeader: { fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8, textTransform: 'uppercase' },
  input: { 
    height: 58, 
    borderColor: '#E2E8F0', 
    borderWidth: 1.5, 
    borderRadius: 16, 
    paddingHorizontal: 18, 
    fontSize: 16, 
    backgroundColor: '#F8FAFC',
    color: '#1E293B'
  },
  button: { 
    backgroundColor: '#0052FF', 
    height: 58, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  forgotButton: { marginTop: 16, alignItems: 'center' },
  forgotText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8', fontSize: 12, fontWeight: '800' },
  secondaryButton: { 
    borderWidth: 2, 
    borderColor: '#0052FF', 
    height: 58, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  secondaryButtonText: { color: '#0052FF', fontWeight: '800', fontSize: 16 },
  footerText: { marginTop: 30, color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 20 }
});