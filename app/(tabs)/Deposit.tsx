import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Share, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

interface DepositProps {
  isDark: boolean;
  onClose: () => void;
}

export default function DepositScreen({ isDark, onClose }: DepositProps) {
  const router = useRouter();
  // New state to manage which view to show
  const [view, setView] = useState<'methods' | 'bank' | 'card'>('methods');
  const [amount, setAmount] = useState('');

  const Colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    textMain: isDark ? '#F8FAFC' : '#0F172A',
    textSec: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    accent: '#0052FF',
    success: '#10B981',
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Account number copied to clipboard');
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: 'G-Vault Account Details:\nBank: Wema Bank\nAccount: 7012345678\nName: Daniel Gilbert',
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle the header back button
  const handleBack = () => {
    if (view === 'methods') {
      onClose();
    } else {
      setView('methods');
    }
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: Colors.bg }]}>
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          {/* --- PROFESSIONAL HEADER --- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { borderColor: Colors.border }]}>
              <Ionicons 
                name={view === 'methods' ? "close" : "chevron-back"} 
                size={24} 
                color={Colors.textMain} 
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: Colors.textMain }]}>
              {view === 'card' ? 'Top up with Card' : 'Add Money'}
            </Text>
            <TouchableOpacity style={styles.historyBtn}>
              <Ionicons name="time-outline" size={22} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* --- VIEW 1: METHODS LIST --- */}
            {view === 'methods' && (
              <>
                <View style={[styles.promoBanner, { backgroundColor: Colors.accent }]}>
                  <View>
                    <Text style={styles.promoTitle}>Instant Funding</Text>
                    <Text style={styles.promoSub}>Zero fees on all bank transfers today</Text>
                  </View>
                  <MaterialCommunityIcons name="lightning-bolt" size={32} color="#FFF" />
                </View>

                <Text style={[styles.sectionLabel, { color: Colors.textSec }]}>CHOOSE METHOD</Text>
                
                <TouchableOpacity 
                  style={[styles.methodCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}
                  onPress={() => setView('bank')}
                >
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 82, 255, 0.1)' }]}>
                    <Ionicons name="business" size={24} color={Colors.accent} />
                  </View>
                  <View style={styles.flexOne}>
                    <Text style={[styles.methodTitle, { color: Colors.textMain }]}>Bank Transfer</Text>
                    <Text style={[styles.methodSub, { color: Colors.textSec }]}>Receive from any banking app</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>FREE</Text>
                  </View>
                </TouchableOpacity>

                <DepositMethod 
                  title="Top-up with Card" 
                  sub="Instant funding via Debit Card" 
                  icon="card-outline" 
                  tag="FAST"
                  theme={Colors} 
                  onPress={() => setView('card')} // Switching internal view
                />
                
                <DepositMethod 
                  title="Request Money" 
                  sub="Get a link to receive payments" 
                  icon="link-outline" 
                  theme={Colors} 
                />

                <DepositMethod 
                  title="USSD Transfer" 
                  sub="Dial code from your registered SIM" 
                  icon="phone-portrait-outline" 
                  theme={Colors} 
                />

                <View style={styles.securityFooter}>
                  <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
                  <Text style={[styles.securityText, { color: Colors.textSec }]}>
                    Secured by NDIC and Licensed by CBN
                  </Text>
                </View>
              </>
            )}

            {/* --- VIEW 2: BANK DETAILS --- */}
            {view === 'bank' && (
              <View style={styles.bankDetailContainer}>
                <Text style={[styles.detailHeading, { color: Colors.textMain }]}>Transfer to the account below</Text>
                <View style={[styles.bankCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                  <View style={styles.bankHeader}>
                    <div style={styles.bankLogo}>
                      <Text style={styles.bankLogoText}>GV</Text>
                    </div>
                    <View>
                      <Text style={[styles.bankName, { color: Colors.textMain }]}>Wema Bank</Text>
                      <Text style={[styles.bankStatus, { color: Colors.success }]}>● Active</Text>
                    </View>
                  </View>
                  <View style={[styles.divider, { backgroundColor: Colors.border }]} />
                  <View style={styles.accountRow}>
                    <View>
                      <Text style={[styles.accountLabel, { color: Colors.textSec }]}>ACCOUNT NUMBER</Text>
                      <Text style={[styles.accountNumber, { color: Colors.textMain }]}>7012345678</Text>
                    </View>
                    <TouchableOpacity onPress={() => copyToClipboard('7012345678')} style={[styles.copyBtn, {backgroundColor: Colors.accent}]}>
                      <Text style={styles.copyBtnText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.accountRow}>
                    <View>
                      <Text style={[styles.accountLabel, { color: Colors.textSec }]}>ACCOUNT NAME</Text>
                      <Text style={[styles.accountName, { color: Colors.textMain }]}>G-Vault / Daniel Gilbert</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.infoBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                  <Ionicons name="flash" size={18} color="#FBBF24" />
                  <Text style={[styles.infoText, { color: Colors.textMain }]}>
                    Funds usually reflect in less than 30 seconds.
                  </Text>
                </View>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={[styles.shareBtn, { backgroundColor: Colors.accent }]} onPress={onShare}>
                    <Ionicons name="share-social-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                    <Text style={styles.shareBtnText}>Share Account Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.backLink} onPress={() => setView('methods')}>
                    <Text style={[styles.backLinkText, { color: Colors.accent }]}>Try another way</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- VIEW 3: CARD FORM (Integrated from your card.tsx) --- */}
            {view === 'card' && (
              <View>
                <Text style={[styles.label, { color: Colors.textSec }]}>I WANT TO TOP UP</Text>
                <View style={[styles.amountContainer, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                  <Text style={[styles.currency, { color: Colors.textMain }]}>₦</Text>
                  <TextInput
                    style={[styles.input, { color: Colors.textMain }]}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textSec}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                  />
                </View>

                <View style={[styles.cardForm, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                  <Text style={[styles.cardLabel, { color: Colors.textSec }]}>CARD DETAILS</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="card-outline" size={20} color={Colors.accent} />
                    <TextInput 
                      placeholder="0000 0000 0000 0000" 
                      placeholderTextColor={Colors.textSec}
                      style={[styles.cardInput, { color: Colors.textMain }]}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.expiryCvvRow}>
                    <TextInput 
                      placeholder="MM/YY" 
                      placeholderTextColor={Colors.textSec}
                      style={[styles.cardInputHalf, { color: Colors.textMain, borderRightWidth: 1, borderColor: Colors.border }]}
                    />
                    <TextInput 
                      placeholder="CVV" 
                      placeholderTextColor={Colors.textSec}
                      secureTextEntry
                      style={[styles.cardInputHalf, { color: Colors.textMain }]}
                    />
                  </View>
                </View>

                <View style={styles.secureNote}>
                  <Ionicons name="lock-closed" size={14} color="#10B981" />
                  <Text style={styles.secureText}>PCI-DSS Compliant • 256-bit Encryption</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.payBtn, { backgroundColor: amount ? Colors.accent : Colors.textSec }]}
                  disabled={!amount}
             onPress={() => router.push('/success' as any)}
                >
                  <Text style={styles.payBtnText}>Pay ₦{amount || '0.00'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backLink} onPress={() => setView('methods')}>
                   <Text style={[styles.backLinkText, { color: Colors.accent, textAlign: 'center' }]}>Use another method</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// --- REUSABLE COMPONENT ---
function DepositMethod({ title, sub, icon, tag, theme, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.methodCardSmall, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={[styles.iconBoxSmall, { backgroundColor: theme.bg }]}>
        <Ionicons name={icon} size={20} color={theme.textMain} />
      </View>
      <View style={styles.flexOne}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.methodTitleSmall, { color: theme.textMain }]}>{title}</Text>
            {tag && <View style={styles.miniTag}><Text style={styles.miniTagText}>{tag}</Text></View>}
        </View>
        <Text style={[styles.methodSubSmall, { color: theme.textSec }]}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.textSec} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeContainer: { flex: 1 },
  flexOne: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  historyBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  promoBanner: { padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  promoTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 15 },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 15 },
  iconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodTitle: { fontSize: 16, fontWeight: '700' },
  methodSub: { fontSize: 12, marginTop: 2 },
  tagContainer: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  methodCardSmall: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  iconBoxSmall: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodTitleSmall: { fontSize: 15, fontWeight: '600' },
  methodSubSmall: { fontSize: 12, marginTop: 2 },
  miniTag: { backgroundColor: '#EEF2FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  miniTagText: { color: '#0052FF', fontSize: 9, fontWeight: '800' },
  securityFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 6 },
  securityText: { fontSize: 11, fontWeight: '500' },
  bankDetailContainer: { marginTop: 5 },
  detailHeading: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  bankCard: { padding: 24, borderRadius: 28, borderWidth: 1, marginBottom: 20 },
  bankHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  bankLogo: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#0052FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bankLogoText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  bankName: { fontSize: 18, fontWeight: '700' },
  bankStatus: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, width: '100%', marginBottom: 20 },
  accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  accountLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  accountNumber: { fontSize: 28, fontWeight: '800', letterSpacing: 1.5 },
  accountName: { fontSize: 16, fontWeight: '600' },
  copyBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  copyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  infoBox: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 13, fontWeight: '500' },
  buttonGroup: { marginTop: 30, alignItems: 'center' },
  shareBtn: { width: '100%', height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  shareBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  backLink: { marginTop: 20 },
  backLinkText: { fontSize: 14, fontWeight: '700' },
  
  // Styles for integrated Card view
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12, marginTop: 10 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 25 },
  currency: { fontSize: 28, fontWeight: '800', marginRight: 10 },
  input: { fontSize: 32, fontWeight: '800', flex: 1 },
  cardForm: { borderRadius: 24, borderWidth: 1, padding: 20 },
  cardLabel: { fontSize: 10, fontWeight: '700', marginBottom: 15 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingBottom: 12 },
  cardInput: { marginLeft: 10, fontSize: 16, flex: 1, fontWeight: '600' },
  expiryCvvRow: { flexDirection: 'row', marginTop: 15 },
  cardInputHalf: { flex: 1, paddingVertical: 10, fontSize: 16, textAlign: 'center', fontWeight: '600' },
  secureNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 6 },
  secureText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  payBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  payBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});