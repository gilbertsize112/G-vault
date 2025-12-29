import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Alert,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Mode = 'SCAN' | 'MY_CODE';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('SCAN');
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'SCAN') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [mode]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7], 
  });

  if (!permission) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      {mode === 'SCAN' ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          onBarcodeScanned={scanned ? undefined : ({data}) => {
            setScanned(true);
            Alert.alert("Success", `Scanning: ${data}`, [{text: "OK", onPress: () => setScanned(false)}]);
          }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0052FF' }]} />
      )}

      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setMode('SCAN')} style={[styles.tab, mode === 'SCAN' && styles.activeTab]}>
              <Text style={[styles.tabText, mode === 'SCAN' && styles.activeTabText]}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('MY_CODE')} style={[styles.tab, mode === 'MY_CODE' && styles.activeTab]}>
              <Text style={[styles.tabText, mode === 'MY_CODE' && styles.activeTabText]}>My Code</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setTorch(!torch)} style={styles.closeBtn}>
            <Ionicons name={torch ? "flash" : "flash-off"} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {mode === 'SCAN' ? (
          <View style={styles.scanContainer}>
            <View style={styles.viewfinder}>
              <View style={[styles.corner, { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 }]} />
              <View style={[styles.corner, { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 }]} />
              <View style={[styles.corner, { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 }]} />
              <View style={[styles.corner, { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 }]} />
              <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
            </View>
            <Text style={styles.scanHint}>Align QR code within the frame to pay</Text>
          </View>
        ) : (
          <View style={styles.myCodeContainer}>
            <View style={styles.whiteCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLabel}>DG</Text>
                </View>
                <Text style={styles.name}>Daniel Gilbert</Text>
                <Text style={styles.subtext}>G-Vault: 8123456789</Text>
              </View>

              {/* Realistic QR Container */}
              <View style={styles.qrWrapper}>
                <MaterialCommunityIcons name="qrcode-scan" size={200} color="#000" />
                {/* Central Brand Logo Overlay */}
                <View style={styles.qrLogoBox}>
                   <MaterialCommunityIcons name="shield-check" size={28} color="#0052FF" />
                </View>
              </View>

              <Text style={styles.useText}>Scan this code to pay me</Text>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="pencil" size={18} color="#0052FF" />
                  <Text style={styles.actionText}>Set Amount</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="download" size={18} color="#0052FF" />
                  <Text style={styles.actionText}>Save Image</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.securityText}>Secured by G-Vault Encryption</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 25, padding: 4, width: 200 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 21 },
  activeTab: { backgroundColor: '#FFF' },
  tabText: { color: '#999', fontSize: 13, fontWeight: '700' },
  activeTabText: { color: '#0052FF' },

  // Scan Logic UI
  scanContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewfinder: { width: width * 0.7, height: width * 0.7, position: 'relative' },
  corner: { position: 'absolute', width: 25, height: 25, borderColor: '#0052FF', borderWidth: 4, borderRadius: 2 },
  laser: { position: 'absolute', width: '100%', height: 2, backgroundColor: '#0052FF', shadowColor: '#0052FF', shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  scanHint: { color: '#FFF', marginTop: 40, fontWeight: '500', opacity: 0.8 },

  // My Code UI (The OPay/Fintech Feel)
  myCodeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  whiteCard: { 
    backgroundColor: '#FFF', 
    width: width * 0.88, 
    borderRadius: 35, 
    padding: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  userInfo: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarLabel: { color: '#0052FF', fontWeight: '800', fontSize: 18 },
  name: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtext: { color: '#64748B', fontSize: 14, marginTop: 4 },
  
  qrWrapper: { 
    padding: 15, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrLogoBox: { 
    position: 'absolute', 
    backgroundColor: '#FFF', 
    padding: 6, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  useText: { color: '#94A3B8', fontSize: 13, marginVertical: 25 },
  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', width: '100%', paddingTop: 20 },
  actionItem: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionText: { color: '#0052FF', fontWeight: '700', fontSize: 14 },
  verticalDivider: { width: 1, height: 20, backgroundColor: '#F1F5F9' },

  securityBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 30, gap: 8 },
  securityText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' }
});