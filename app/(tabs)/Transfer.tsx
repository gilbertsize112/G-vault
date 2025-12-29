import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import your new screen here
import NextScreen from './Next'; 

const NIGERIAN_BANKS = [
  // --- Commercial Banks ---
  { id: '1', name: 'Access Bank', code: '044', logo: 'A', color: '#004a88' },
  { id: '2', name: 'GTBank', code: '058', logo: 'GT', color: '#dd4b39' },
  { id: '3', name: 'Zenith Bank', code: '070', logo: 'Z', color: '#da291c' },
  { id: '5', name: 'United Bank for Africa (UBA)', code: '033', logo: 'U', color: '#cf102d' },
  { id: '6', name: 'First Bank', code: '011', logo: 'F', color: '#003b64' },
  { id: '10', name: 'Stanbic IBTC Bank', code: '039', logo: 'S', color: '#0033a1' },
  { id: '13', name: 'Wema Bank', code: '035', logo: 'W', color: '#9d1a34' },
  { id: '11', name: 'Fidelity Bank', code: '070', logo: 'FB', color: '#042d74' },
  { id: '12', name: 'Ecobank Nigeria', code: '050', logo: 'E', color: '#005a96' },
  { id: '14', name: 'FCMB', code: '214', logo: 'FC', color: '#5c2d91' },
  { id: '15', name: 'Sterling Bank', code: '232', logo: 'SB', color: '#e31837' },
  { id: '16', name: 'Union Bank', code: '032', logo: 'U', color: '#009fe3' },
  { id: '17', name: 'Unity Bank', code: '215', logo: 'UB', color: '#f37021' },
  { id: '18', name: 'Polaris Bank', code: '076', logo: 'P', color: '#5a2d81' },
  { id: '19', name: 'Keystone Bank', code: '082', logo: 'K', color: '#003399' },
  { id: '20', name: 'Citibank', code: '023', logo: 'C', color: '#00448d' },
  { id: '21', name: 'Standard Chartered', code: '068', logo: 'SC', color: '#009444' },
  { id: '22', name: 'Titan Trust Bank', code: '102', logo: 'T', color: '#003399' },
  { id: '24', name: 'Globus Bank', code: '103', logo: 'G', color: '#313335' },
  { id: '25', name: 'Providus Bank', code: '101', logo: 'PB', color: '#000000' },
  { id: '26', name: 'Parallex Bank', code: '104', logo: 'P', color: '#e60000' },
  { id: '27', name: 'Premium Trust Bank', code: '105', logo: 'PT', color: '#004a88' },
  { id: '28', name: 'Signature Bank', code: '106', logo: 'SB', color: '#c5a059' },
  { id: '29', name: 'SunTrust Bank', code: '100', logo: 'ST', color: '#004a88' },
  { id: '30', name: 'Optimus Bank', code: '107', logo: 'OB', color: '#10B981' },

  // --- Digital & Microfinance ---
  { id: '4', name: 'Kuda Bank', code: '50211', logo: 'K', color: '#40196d' },
  { id: '7', name: 'Opay (Digital)', code: '999992', logo: 'O', color: '#00b875' },
  { id: '8', name: 'Moniepoint MFB', code: '50300', logo: 'M', color: '#003399' },
  { id: '9', name: 'Palmpay', code: '999991', logo: 'P', color: '#7a22e0' },
  { id: '23', name: 'FairMoney MFB', code: '090551', logo: 'FM', color: '#2b58f6' },
  { id: '31', name: 'VFD MFB', code: '566', logo: 'V', color: '#1a1a1a' },
  { id: '32', name: 'Mint Finex MFB', code: '50304', logo: 'MF', color: '#10B981' },
  { id: '33', name: 'Raven Bank', code: '50325', logo: 'R', color: '#6e3ff3' },
  { id: '34', name: 'Sparkle Bank', code: '51310', logo: 'S', color: '#000000' },
  { id: '35', name: 'Rubies Bank', code: '125', logo: 'RB', color: '#e91e63' },
  { id: '36', name: 'Dot Bank', code: '50162', logo: 'D', color: '#2a2a2a' },
  { id: '37', name: 'Accion MFB', code: '602', logo: 'AC', color: '#007dc3' },
  { id: '38', name: 'Lapo MFB', code: '504', logo: 'L', color: '#f48221' },
  
  // --- Non-Interest ---
  { id: '39', name: 'Jaiz Bank', code: '301', logo: 'J', color: '#006837' },
  { id: '40', name: 'Lotus Bank', code: '303', logo: 'L', color: '#1e3a8a' },
  { id: '41', name: 'TAJBank', code: '302', logo: 'T', color: '#c1272d' },
  { id: '42', name: 'Alternative Bank', code: '304', logo: 'A', color: '#000000' },
];

interface TransferProps {
  isDark: boolean;
  onClose: () => void;
  currentBalance: number;
  updateBalance: (newVal: number) => void;
  onConfirm: (amount: string, name: string, bank: string, acc: string, note?: string) => void;
}

export default function TransferScreen({ 
  isDark, 
  onClose, 
  currentBalance, 
  updateBalance,
  onConfirm 
}: TransferProps) {
  const [showBankList, setShowBankList] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [showNextStep, setShowNextStep] = useState(false);

  // SECURE KEY ACCESS
  const PAYSTACK_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY;

  const Colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    textMain: isDark ? '#F8FAFC' : '#0F172A',
    textSec: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    accent: '#10B981',
  };

  useEffect(() => {
    const resolveAccount = async () => {
      if (accountNumber.length === 10) {
        setIsVerifying(true);
        setVerifiedName(null);

        if (selectedBank) {
          try {
            const response = await fetch(
              `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${selectedBank.code}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${PAYSTACK_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            const data = await response.json();
            if (data.status) {
              setVerifiedName(data.data.account_name);
            } else {
              setVerifiedName("Account not found in " + selectedBank.name);
            }
          } catch (error) {
            setVerifiedName("Lookup failed. Check internet.");
          } finally {
            setIsVerifying(false);
          }
          return;
        }

        for (const bank of NIGERIAN_BANKS) {
          try {
            const response = await fetch(
              `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bank.code}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${PAYSTACK_KEY}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            const data = await response.json();
            if (data.status) {
              setSelectedBank(bank); 
              setVerifiedName(data.data.account_name);
              setIsVerifying(false);
              return; 
            }
          } catch (e) {}
        }
        setVerifiedName("Could not auto-link. Please select bank manually.");
        setIsVerifying(false);
      }
    };

    resolveAccount();
  }, [accountNumber, selectedBank]);

  const filteredBanks = NIGERIAN_BANKS.filter(bank => 
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const isError = verifiedName?.includes("not found") || verifiedName?.includes("Could not") || verifiedName?.includes("failed");

  if (showNextStep) {
    return (
      <NextScreen 
        isDark={isDark}
        recipientName={verifiedName || ''}
        bankName={selectedBank?.name || ''}
        accountNumber={accountNumber}
        bankLogo={selectedBank?.logo || '?'}
        bankColor={selectedBank?.color || Colors.accent}
        currentBalance={currentBalance} 
        updateBalance={updateBalance}   
        onBack={() => setShowNextStep(false)}
        onConfirm={(amount, note) => {
          onConfirm(
            amount, 
            verifiedName || '', 
            selectedBank?.name || '', 
            accountNumber, 
            note
          );
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.mainWrapper, { backgroundColor: Colors.bg }]}
    >
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={[styles.backBtn, { borderColor: Colors.border }]}>
            <Ionicons name="close" size={22} color={Colors.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.textMain }]}>Transfer to Bank Account</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: Colors.textSec }]}>Recipient Account</Text>
            
            <View style={[styles.inputWrapper, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
              <TextInput 
                placeholder="Enter 10-digit Account Number" 
                placeholderTextColor={Colors.textSec}
                keyboardType="number-pad"
                maxLength={10}
                value={accountNumber}
                onChangeText={(val) => {
                    setAccountNumber(val);
                    if (val.length < 10) {
                      setVerifiedName(null);
                      setSelectedBank(null);
                    }
                }}
                style={[styles.textInput, { color: Colors.textMain }]}
              />
              {isVerifying && <ActivityIndicator size="small" color={Colors.accent} />}
              {verifiedName && !isError && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
              )}
            </View>

            <TouchableOpacity 
              onPress={() => setShowBankList(true)}
              style={[styles.inputWrapper, { backgroundColor: Colors.card, borderColor: Colors.border, marginTop: 12 }]}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.bankPlaceholder, { color: selectedBank ? Colors.textMain : Colors.textSec }]}>
                    {selectedBank ? selectedBank.name : 'Select Bank'}
                </Text>
                {accountNumber.length === 10 && !selectedBank && isVerifying && (
                    <View style={styles.suggestedBadge}><Text style={styles.suggestedText}>Linking bank...</Text></View>
                )}
              </View>
              <Ionicons name="chevron-down" size={18} color={Colors.textSec} />
            </TouchableOpacity>

            {verifiedName && (
              <View style={[styles.verifiedNameCard, { 
                backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'), 
                borderColor: isError ? '#EF4444' : Colors.accent 
              }]}>
                <Ionicons 
                  name={isError ? "alert-circle" : "person-circle"} 
                  size={20} 
                  color={isError ? '#EF4444' : Colors.accent} 
                />
                <Text style={[styles.verifiedNameText, { color: isError ? '#EF4444' : Colors.textMain }]}>
                  {verifiedName}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => setShowNextStep(true)} 
              disabled={!verifiedName || isError}
              style={[styles.nextBtn, { 
                backgroundColor: (verifiedName && !isError) ? Colors.accent : Colors.border, 
                opacity: (verifiedName && !isError) ? 1 : 0.6 
              }]}
            >
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.successMonitor, { backgroundColor: isDark ? '#064e3b' : '#ecfdf5' }]}>
            <Ionicons name="stats-chart" size={14} color={Colors.accent} />
            <Text style={[styles.successText, { color: isDark ? '#a7f3d0' : '#065f46' }]}>
              Bank transfer success rate monitor (99.2%)
            </Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={[styles.searchBar, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
            <Ionicons name="search" size={18} color={Colors.textSec} />
            <TextInput 
              placeholder="Search beneficiary or bank" 
              placeholderTextColor={Colors.textSec}
              style={[styles.searchInput, { color: Colors.textMain }]}
            />
          </View>

          <View style={styles.beneficiaryHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.textSec }]}>RECENT & FAVOURITES</Text>
            <TouchableOpacity><Ionicons name="star-outline" size={18} color={Colors.accent} /></TouchableOpacity>
          </View>

          <View style={styles.recentGrid}>
            <RecentItem name="James" bank="GTBank" theme={Colors} />
            <RecentItem name="Sarah" bank="Kuda" theme={Colors} />
            <RecentItem name="Mama" bank="Access" theme={Colors} />
            <RecentItem name="David" bank="Zenith" theme={Colors} />
          </View>
        </ScrollView>

        <Modal visible={showBankList} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.bankSheet, { backgroundColor: Colors.card }]}>
              <View style={styles.sheetHeader}>
                <View style={[styles.dragHandle, { backgroundColor: Colors.border }]} />
                <View style={styles.sheetTitleRow}>
                  <Text style={[styles.sheetTitle, { color: Colors.textMain }]}>Select Bank</Text>
                  <TouchableOpacity onPress={() => setShowBankList(false)}>
                    <Ionicons name="close-circle" size={24} color={Colors.textSec} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.modalSearch, { backgroundColor: Colors.bg }]}>
                  <Ionicons name="search" size={18} color={Colors.textSec} />
                  <TextInput 
                    placeholder="Search Banks" 
                    placeholderTextColor={Colors.textSec}
                    style={[styles.searchInput, { color: Colors.textMain }]}
                    onChangeText={setBankSearch}
                  />
                </View>
              </View>

              <FlatList
                data={filteredBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.bankItem}
                    onPress={() => {
                      setSelectedBank(item);
                      setShowBankList(false);
                      setBankSearch('');
                    }}
                  >
                    <View style={[styles.bankLogo, { backgroundColor: item.color }]}>
                      <Text style={styles.logoText}>{item.logo}</Text>
                    </View>
                    <Text style={[styles.bankName, { color: Colors.textMain }]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function RecentItem({ name, bank, theme }: { name: string, bank: string, theme: any }) {
    return (
      <TouchableOpacity style={styles.recentBox}>
        <View style={[styles.avatar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.avatarText, { color: theme.textMain }]}>{name[0]}</Text>
          <View style={styles.favBadge}><Ionicons name="heart" size={8} color="#FFF" /></View>
        </View>
        <Text style={[styles.recentName, { color: theme.textMain }]}>{name}</Text>
        <Text style={[styles.recentBank, { color: theme.textSec }]}>{bank}</Text>
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeContainer: { flex: 1 },
  spacer: { width: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  scrollContent: { padding: 20 },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase' },
  inputWrapper: { height: 60, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  textInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  bankPlaceholder: { fontSize: 15, fontWeight: '600' },
  suggestedBadge: { marginLeft: 10, backgroundColor: '#10B98120', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  suggestedText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  verifiedNameCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginTop: 12, gap: 10 },
  verifiedNameText: { fontSize: 14, fontWeight: '800' },
  nextBtn: { height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  nextBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  successMonitor: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 8, marginBottom: 25 },
  successText: { fontSize: 11, fontWeight: '600' },
  dividerLine: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginBottom: 25 },
  searchBar: { height: 50, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 25 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  beneficiaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  recentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recentBox: { width: '22%', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative' },
  avatarText: { fontWeight: '700', fontSize: 16 },
  favBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#EF4444', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  recentName: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  recentBank: { fontSize: 10, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bankSheet: { height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  dragHandle: { width: 40, height: 5, borderRadius: 2.5, alignSelf: 'center', marginBottom: 15 },
  sheetHeader: { marginBottom: 10 },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sheetTitle: { fontSize: 20, fontWeight: '800' },
  modalSearch: { height: 50, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  bankItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.05)' },
  bankLogo: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  logoText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  bankName: { flex: 1, fontSize: 15, fontWeight: '600' }
});