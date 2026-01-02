import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, 
  KeyboardAvoidingView, Platform, ScrollView, Keyboard, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CardScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = true; 
  const Colors = {
    bg: '#020617',
    card: '#0F172A',
    textMain: '#F8FAFC',
    textSec: '#94A3B8',
    accent: '#0052FF',
    border: '#1E293B',
    success: '#10B981'
  };

  // Professional Payment Simulation
  const handlePay = () => {
    setLoading(true);
    Keyboard.dismiss();
    
    // Simulate bank processing
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/success',
        params: { amount: amount }
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.textMain }]}>Card Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* --- VISUAL DEBIT CARD --- */}
          <View style={[styles.visualCard, { backgroundColor: Colors.accent }]}>
            <View style={styles.cardTop}>
              <Ionicons name="wifi-outline" size={24} color="#FFF" style={{transform: [{ rotate: '90deg' }]}} />
              <Text style={styles.bankName}>G-VAULT PREMIUM</Text>
            </View>
            <Text style={styles.visualCardNumber}>
              {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, '$& ') : '**** **** **** ****'}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabelSmall}>EXPIRY</Text>
                <Text style={styles.cardValueSmall}>{expiry || 'MM/YY'}</Text>
              </View>
              <View style={styles.chip} />
            </View>
          </View>

          <View style={styles.content}>
            {/* Amount Section */}
            <View style={[styles.amountBox, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
               <Text style={[styles.label, { color: Colors.textSec }]}>TOP UP AMOUNT</Text>
               <View style={styles.rowCentered}>
                  <Text style={[styles.currency, { color: Colors.textMain }]}>₦</Text>
                  <TextInput
                    style={[styles.input, { color: Colors.textMain }]}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textSec}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                  />
               </View>
            </View>

            {/* Form Section */}
            <View style={[styles.formContainer, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: Colors.textSec }]}>CARD NUMBER</Text>
                <TextInput 
                  placeholder="0000 0000 0000 0000" 
                  placeholderTextColor="#475569"
                  style={[styles.textInput, { color: Colors.textMain }]}
                  keyboardType="number-pad"
                  maxLength={16}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 15 }]}>
                  <Text style={[styles.inputLabel, { color: Colors.textSec }]}>EXPIRY</Text>
                  <TextInput 
                    placeholder="MM/YY" 
                    placeholderTextColor="#475569"
                    style={[styles.textInput, { color: Colors.textMain }]}
                    keyboardType="number-pad"
                    maxLength={5}
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: Colors.textSec }]}>CVV</Text>
                  <TextInput 
                    placeholder="***" 
                    placeholderTextColor="#475569"
                    secureTextEntry
                    style={[styles.textInput, { color: Colors.textMain }]}
                    keyboardType="number-pad"
                    maxLength={3}
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </View>

            <View style={styles.secureBadge}>
               <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
               <Text style={[styles.secureText, { color: Colors.textSec }]}>Your payment is secured and encrypted</Text>
            </View>

            <TouchableOpacity 
              style={[styles.payBtn, { backgroundColor: amount && cardNumber.length > 10 ? Colors.accent : '#1E293B' }]}
              disabled={!amount || loading}
              onPress={handlePay}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.payBtnText}>Pay ₦{amount || '0.00'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { paddingBottom: 40 },
  
  // Visual Card Design
  visualCard: { height: 200, margin: 20, borderRadius: 24, padding: 25, justifyContent: 'space-between', elevation: 10, shadowColor: '#0052FF', shadowOpacity: 0.3, shadowRadius: 15 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bankName: { color: '#FFF', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  visualCardNumber: { color: '#FFF', fontSize: 22, fontWeight: '700', letterSpacing: 2, marginVertical: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabelSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600' },
  cardValueSmall: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  chip: { width: 45, height: 35, backgroundColor: '#FFD700', borderRadius: 8, opacity: 0.8 },

  content: { paddingHorizontal: 20 },
  amountBox: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 20 },
  rowCentered: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 10, fontWeight: '700', marginBottom: 8 },
  currency: { fontSize: 24, fontWeight: '800', marginRight: 8 },
  input: { fontSize: 28, fontWeight: '800', flex: 1 },

  formContainer: { padding: 20, borderRadius: 24, borderWidth: 1 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '700', marginBottom: 10 },
  textInput: { fontSize: 16, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingBottom: 8 },
  row: { flexDirection: 'row' },

  secureBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25, gap: 8 },
  secureText: { fontSize: 12, fontWeight: '500' },
  
  payBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  payBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' }
});