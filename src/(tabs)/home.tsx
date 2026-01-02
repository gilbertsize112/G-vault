import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Added useRouter

// Ensure these filenames match exactly in your folder
import DepositScreen from './Deposit';
import TransferScreen from './Transfer'; 
import Receipt from './Receipt'; 

// --- TYPES ---
interface ThemeColors {
  bg: string;
  card: string;
  textMain: string;
  textSec: string;
  border: string;
  accent: string;
  balanceCard: string[];
}

export default function Home() {
  const router = useRouter(); // Initialize router
  const [showBalance, setShowBalance] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false); 
  
  // Navigation & Data States
  const [viewMode, setViewMode] = useState<'home' | 'receipt'>('home');
  const [receiptData, setReceiptData] = useState({ 
    amount: '', 
    name: '', 
    bank: '',
    accountNumber: '',
    note: ''
  });

  // --- BALANCE STATE ---
  const [balance, setBalance] = useState(19260000.00);

  const Colors: ThemeColors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    textMain: isDark ? '#F8FAFC' : '#0F172A',
    textSec: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    accent: '#0052FF', // Unified Fintech Blue
    balanceCard: isDark ? ['#1E293B', '#020617'] : ['#0052FF', '#003BBF'], 
  };

  // Function called after PIN is correctly entered in TransferScreen
  const handleTransferSuccess = (amount: string, name: string, bank: string, acc: string, note?: string) => {
    setReceiptData({ 
      amount, 
      name, 
      bank, 
      accountNumber: acc, 
      note: note || 'Bank Transfer' 
    });
    setShowTransfer(false);
    setViewMode('receipt');
  };

  // --- CONDITIONAL RENDERING FOR RECEIPT ---
  if (viewMode === 'receipt') {
    return (
      <Receipt 
        isDark={isDark}
        amount={receiptData.amount}
        recipientName={receiptData.name}
        bankName={receiptData.bank}
        accountNumber={receiptData.accountNumber}
        note={receiptData.note}
        onClose={() => setViewMode('home')}
      />
    );
  }

  return (
    <View style={[styles.mainWrapper, { backgroundColor: Colors.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          
          {/* --- HEADER --- */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: Colors.accent }]}>
                <Text style={styles.avatarText}>DG</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.greeting, { color: Colors.textSec }]}>Total Balance</Text>
                <Text style={[styles.userName, { color: Colors.textMain }]}>Daniel Gilbert</Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={[styles.themeToggle, { backgroundColor: Colors.card, borderColor: Colors.border }]} 
                onPress={() => setIsDark(!isDark)}
              >
                <Ionicons 
                  name={isDark ? "sunny" : "moon"} 
                  size={16} 
                  color={isDark ? "#FBBF24" : "#6366F1"} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textMain} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* --- BALANCE CARD --- */}
            <View style={styles.cardWrapper}>
              <LinearGradient colors={Colors.balanceCard as any} style={styles.balanceCard}>
                <View style={styles.cardInfoSection}>
                  <View>
                    <View style={styles.labelRow}>
                      <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                      <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeIcon}>
                        <Ionicons name={showBalance ? "eye-off" : "eye"} size={14} color="rgba(255,255,255,0.5)" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.balanceAmount}>
                      {showBalance ? `₦${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "₦ • • • • • •"}
                    </Text>
                  </View>
                  <View style={styles.tierBadge}>
                    <Ionicons name="shield-checkmark" size={10} color="#10B981" />
                    <Text style={styles.tierText}>DIAMOND</Text>
                  </View>
                </View>
                
                <View style={styles.cardActionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setShowDeposit(true)}>
                    <Ionicons name="add" size={18} color="#FFF" />
                    <Text style={styles.actionBtnText}>Deposit</Text>
                  </TouchableOpacity>

                  <View style={styles.dividerLine} />

                  <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTransfer(true)}>
                    <Ionicons name="arrow-up" size={16} color="#FFF" />
                    <Text style={styles.actionBtnText}>Transfer</Text>
                  </TouchableOpacity>

                  <View style={styles.dividerLine} />

                  {/* Updated Scan Button to use router.push */}
                  <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/scan')}>
                    <Ionicons name="qr-code" size={16} color="#FFF" />
                    <Text style={styles.actionBtnText}>Scan</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* --- SERVICES --- */}
            <View style={styles.serviceSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: Colors.textSec }]}>Quick Services</Text>
                <TouchableOpacity>
                  <Text style={{color: Colors.accent, fontSize: 12, fontWeight: '600'}}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.serviceGrid}>
                <ServiceItem name="Bank" icon="business" color={Colors.accent} theme={Colors} />
                <ServiceItem name="Airtime" icon="phone-portrait" color="#38BDF8" theme={Colors} />
                <ServiceItem name="Data" icon="wifi" color="#818CF8" theme={Colors} />
                <ServiceItem name="Utility" icon="flash" color="#FBBF24" theme={Colors} />
                <ServiceItem name="Stocks" icon="trending-up" color="#F472B6" theme={Colors} />
                <ServiceItem name="Crypto" icon="logo-bitcoin" color="#FB7185" theme={Colors} />
                <ServiceItem name="Safe" icon="lock-closed" color="#2DD4BF" theme={Colors} />
                <ServiceItem name="More" icon="grid-outline" color="#94A3B8" theme={Colors} />
              </View>
            </View>

            <TouchableOpacity style={[styles.upgradeBanner, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
              <View style={styles.upgradeIcon}>
                <Ionicons name="ribbon" size={18} color={Colors.accent} />
              </View>
              <Text style={[styles.upgradeText, { color: Colors.textMain }]}>Complete KYC to increase your daily limit</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textSec} />
            </TouchableOpacity>

          </ScrollView>

          {/* --- MODALS --- */}
          <Modal visible={showDeposit} animationType="slide" transparent={false}>
            <DepositScreen isDark={isDark} onClose={() => setShowDeposit(false)} />
          </Modal>

          <Modal visible={showTransfer} animationType="slide" transparent={false}>
            <TransferScreen 
              isDark={isDark} 
              onClose={() => setShowTransfer(false)} 
              currentBalance={balance}
              updateBalance={(newVal: number) => setBalance(newVal)}
              onConfirm={(amt, name, bank, acc, note) => handleTransferSuccess(amt, name, bank, acc, note)} 
            />
          </Modal>

          {/* --- TAB BAR --- */}
          <View style={[styles.floatingTabs, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
            <TabItem icon="home" active={true} theme={Colors} />
            <TabItem icon="bar-chart" active={false} theme={Colors} />
            <TabItem icon="wallet" active={false} theme={Colors} />
            <TabItem icon="person" active={false} theme={Colors} />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

// --- SUB-COMPONENTS ---
function TabItem({ icon, active, theme }: any) {
  return (
    <TouchableOpacity style={styles.tabBtn}>
      <Ionicons name={active ? (icon) : (`${icon}-outline` as any)} size={22} color={active ? theme.accent : theme.textSec} />
      {active ? <View style={[styles.activeDot, { backgroundColor: theme.accent }]} /> : null}
    </TouchableOpacity>
  );
}

function ServiceItem({ name, icon, color, theme }: any) {
  return (
    <TouchableOpacity style={styles.serviceItem}>
      <View style={[styles.iconCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.serviceLabel, { color: theme.textMain }]}>{name}</Text>
    </TouchableOpacity>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  safeContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  greeting: { fontSize: 11, fontWeight: '500' },
  userName: { fontSize: 15, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeToggle: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { marginBottom: 25 },
  balanceCard: { padding: 20, borderRadius: 24 },
  cardInfoSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  balanceAmount: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  eyeIcon: { padding: 2 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tierText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  cardActionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  dividerLine: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.2)' },
  serviceSection: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItem: { width: '23%', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 54, height: 54, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  serviceLabel: { fontSize: 11, fontWeight: '600' },
  upgradeBanner: { padding: 14, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  upgradeIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(0, 82, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  upgradeText: { flex: 1, fontSize: 11, fontWeight: '600' },
  floatingTabs: { position: 'absolute', bottom: 30, left: 25, right: 25, height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
  tabBtn: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 }
});