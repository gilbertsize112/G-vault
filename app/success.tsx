import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  // This allows you to catch the amount if you pass it in the router.push
  const { amount } = useLocalSearchParams(); 

  const isDark = true;
  const Colors = {
    bg: '#020617',
    card: '#0F172A',
    textMain: '#F8FAFC',
    textSec: '#94A3B8',
    accent: '#0052FF',
    success: '#10B981',
    border: '#1E293B',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.bg }]}>
      <View style={styles.content}>
        
        {/* Success Animated-style Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.outerCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <View style={[styles.innerCircle, { backgroundColor: Colors.success }]}>
              <Ionicons name="checkmark-sharp" size={50} color="#FFF" />
            </View>
          </View>
        </View>

        <Text style={[styles.title, { color: Colors.textMain }]}>Top-up Successful</Text>
        <Text style={[styles.subtitle, { color: Colors.textSec }]}>
          Your payment has been confirmed and your wallet has been funded.
        </Text>

        {/* Transaction Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: Colors.textSec }]}>Amount Paid</Text>
            <Text style={[styles.value, { color: Colors.textMain }]}>₦{amount || '0.00'}</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: Colors.border }]} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: Colors.textSec }]}>Transaction Type</Text>
            <Text style={[styles.value, { color: Colors.textMain }]}>Card Deposit</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: Colors.textSec }]}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={[styles.statusText, { color: Colors.success }]}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.secureBadge}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.textSec} />
          <Text style={[styles.secureText, { color: Colors.textSec }]}>Transaction ID: GV-{(Math.random() * 1000000).toFixed(0)}</Text>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.doneBtn, { backgroundColor: Colors.accent }]} 
          onPress={() => router.replace('/')} // Goes back to home dashboard
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert("Receipt", "Downloading receipt...")}>
            <Text style={[styles.shareBtnText, { color: Colors.accent }]}>Download Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  iconContainer: { marginBottom: 30 },
  outerCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 15, shadowColor: '#10B981', shadowOpacity: 0.4, shadowRadius: 15 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  summaryCard: { width: '100%', borderRadius: 24, borderWidth: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  label: { fontSize: 14, fontWeight: '500' },
  value: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, width: '100%', marginVertical: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '700' },
  secureBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 25 },
  secureText: { fontSize: 12, fontWeight: '500' },
  footer: { padding: 30 },
  doneBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: '100%' },
  doneBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  shareBtn: { marginTop: 20, alignItems: 'center' },
  shareBtnText: { fontSize: 15, fontWeight: '700' }
});