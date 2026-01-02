import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, 
  Animated, ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();
  }, []);

  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert("Required Fields", "Please complete all fields to secure your investments.");
      return;
    } 
    if (!agree) {
      Alert.alert("Agreement Required", "Please review and accept our terms of service.");
      return;
    }

    // Start Loading Animation
    setIsLoading(true);

    // Simulate a network request (Brain of the app)
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 1500); 
  };

  return (
    <LinearGradient 
      colors={['#0F172A', '#020617']} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Decorative glass effect */}
      <View style={styles.circleDecorator} />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.flex}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#94A3B8" />
            </TouchableOpacity>

            <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.title}>Join the Future</Text>
              <Text style={styles.subtitle}>Secure your assets in one professional dashboard.</Text>
            </Animated.View>

            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
              
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, focusedInput === 'name' && styles.labelFocused]}>Legal Name</Text>
                <View style={[styles.inputWrapper, focusedInput === 'name' && styles.inputWrapperFocused]}>
                  <Ionicons name="person-outline" size={20} color={focusedInput === 'name' ? "#60A5FA" : "#64748B"} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Full name as on ID" 
                    placeholderTextColor="#64748B"
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    value={name} 
                    onChangeText={setName} 
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, focusedInput === 'email' && styles.labelFocused]}>Email Address</Text>
                <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
                  <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? "#60A5FA" : "#64748B"} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="name@email.com" 
                    placeholderTextColor="#64748B"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    value={email} 
                    onChangeText={setEmail} 
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, focusedInput === 'pass' && styles.labelFocused]}>Password</Text>
                <View style={[styles.inputWrapper, focusedInput === 'pass' && styles.inputWrapperFocused]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={focusedInput === 'pass' ? "#60A5FA" : "#64748B"} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Min. 8 characters" 
                    placeholderTextColor="#64748B"
                    secureTextEntry={!showPassword} 
                    onFocus={() => setFocusedInput('pass')}
                    onBlur={() => setFocusedInput(null)}
                    value={password} 
                    onChangeText={setPassword} 
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Professional Checkbox */}
              <TouchableOpacity 
                activeOpacity={0.7}
                style={styles.checkboxContainer} 
                onPress={() => setAgree(!agree)}
              >
                <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                  {agree && <Ionicons name="checkmark-sharp" size={16} color="#FFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  I certify that I am at least 18 years of age and agree to the <Text style={styles.linkText}>Terms of Service</Text>.
                </Text>
              </TouchableOpacity>

              {/* Submit Button with Loading State */}
              <TouchableOpacity 
                activeOpacity={0.9}
                disabled={isLoading}
                style={[styles.mainButton, (!agree || isLoading) && styles.buttonDisabled]} 
                onPress={handleSignUp}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.mainButtonText}>Create Portfolio</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.linkText}>Log In</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  circleDecorator: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E293B',
    opacity: 0.3,
  },
  scrollContent: { paddingHorizontal: 28, paddingTop: 20, paddingBottom: 40 },
  backBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  header: { marginBottom: 40 },
  title: { fontSize: 34, fontWeight: '800', color: '#F8FAFC', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#94A3B8', marginTop: 8, lineHeight: 22 },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 10, marginLeft: 4 },
  labelFocused: { color: '#60A5FA' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#0F172A',
  },
  input: { flex: 1, color: '#F1F5F9', fontSize: 16, marginLeft: 12, fontWeight: '500' },
  checkboxContainer: { flexDirection: 'row', marginTop: 10, marginBottom: 35 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#334155', marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  checkboxText: { flex: 1, color: '#94A3B8', fontSize: 13, lineHeight: 18 },
  linkText: { color: '#60A5FA', fontWeight: '700' },
  mainButton: { 
    height: 64, 
    backgroundColor: '#3B82F6', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonDisabled: { backgroundColor: '#1E293B', opacity: 0.6 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#64748B', fontSize: 14 }
});