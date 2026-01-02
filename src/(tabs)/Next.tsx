import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NextProps {
  isDark: boolean;
  recipientName: string;
  bankName: string;
  accountNumber: string;
  bankLogo: string;
  bankColor: string;
  currentBalance: number; 
  updateBalance: (newVal: number) => void; 
  onBack: () => void;
  onConfirm: (amount: string, note: string, pin: string) => void;
}

export default function NextScreen({ 
  isDark, 
  recipientName, 
  bankName, 
  accountNumber, 
  bankLogo, 
  bankColor, 
  currentBalance, 
  updateBalance,   
  onBack, 
  onConfirm 
}: NextProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Personal');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const CORRECT_PIN = "0806";

  const Colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    textMain: isDark ? '#F8FAFC' : '#0F172A',
    textSec: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    accent: '#10B981',
    blackBtn: isDark ? '#1E293B' : '#0F172A',
    overlay: 'rgba(0, 0, 0, 0.7)',
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          const transferAmount = parseFloat(amount) || 0;
          
          if (transferAmount > currentBalance) {
            alert("Insufficient Funds. Your balance is ₦" + currentBalance.toLocaleString());
            setPin('');
            return;
          }

          setIsProcessing(true);
          setTimeout(() => {
            const newTotal = currentBalance - transferAmount;
            updateBalance(newTotal);

            setIsProcessing(false);
            setIsSuccess(true); 
          }, 1500);
        } else {
          alert("Incorrect PIN. Please try again.");
          setPin('');
        }
      }
    }
  };

  const removeLast = () => setPin(pin.slice(0, -1));

  const handleFinalClose = () => {
      setShowPinModal(false);
      setIsSuccess(false);
      onConfirm(amount, note, pin); 
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { borderColor: Colors.border }]}>
            <Ionicons name="arrow-back" size={22} color={Colors.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.textMain }]}>Transfer to bank account</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.recipientHeader}>
             <View style={[styles.avatarLarge, { backgroundColor: bankColor }]}>
                <Text style={styles.avatarText}>{bankLogo}</Text>
             </View>
             <Text style={[styles.mainName, { color: Colors.textMain }]}>{recipientName}</Text>
             <Text style={[styles.subDetails, { color: Colors.textSec }]}>
               {accountNumber} • {bankName}
             </Text>
          </View>

          <View style={[styles.card, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.cardLabel, { color: Colors.textSec }]}>AMOUNT</Text>
                <Text style={{fontSize: 10, color: Colors.accent, fontWeight: '700'}}>BAL: ₦{currentBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencySymbol, { color: Colors.textMain }]}>₦</Text>
              <TextInput
                placeholder="100.00-10,000,000.00"
                placeholderTextColor={Colors.textSec}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={[styles.amountInput, { color: Colors.textMain }]}
              />
            </View>
            <View style={styles.quickAmountGrid}>
              {['1000', '2000', '5000', '10000'].map((val) => (
                <TouchableOpacity key={val} onPress={() => setAmount(val)} style={[styles.moneyBox, { borderColor: Colors.border }]}>
                  <Text style={[styles.moneyBoxText, { color: Colors.textMain }]}>₦{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
            <Text style={[styles.cardLabel, { color: Colors.textSec }]}>REMARK</Text>
            <TextInput
              placeholder="What's this for?"
              placeholderTextColor={Colors.textSec}
              value={note}
              onChangeText={setNote}
              style={[styles.remarkInput, { color: Colors.textMain, borderBottomColor: Colors.border }]}
            />
            <View style={styles.categoryRow}>
              {['Purchase', 'Personal'].map((cat) => (
                <TouchableOpacity 
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.catBox, { backgroundColor: category === cat ? Colors.accent : Colors.blackBtn }]}
                >
                  <Ionicons name={cat === 'Purchase' ? "cart" : "person"} size={16} color="#FFF" />
                  <Text style={styles.catText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => setShowPinModal(true)}
              disabled={!amount}
              activeOpacity={0.8}
              style={[styles.confirmBtn, { backgroundColor: amount ? Colors.accent : Colors.textSec, opacity: amount ? 1 : 0.6 }]}
            >
              <Text style={styles.confirmBtnText}>Confirm Transfer</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={16} color={amount ? Colors.accent : Colors.textSec} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showPinModal} animationType="slide" transparent={true}>
        <View style={[styles.modalOverlay, { backgroundColor: Colors.overlay }]}>
          {/* UPDATED: Changed from 'div' to 'View' to ensure it runs on iOS/Android */}
          <View style={[styles.pinSheet, { backgroundColor: Colors.card }]}>
            <View style={styles.sheetHandle} />
            
            {!isSuccess ? (
                <>
                    <TouchableOpacity onPress={() => setShowPinModal(false)} style={styles.closeModal}>
                        <Ionicons name="close-circle" size={32} color={Colors.textSec} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.pinTitle, { color: Colors.textMain }]}>Security PIN</Text>
                    <Text style={[styles.pinSub, { color: Colors.textSec }]}>Enter your 4-digit PIN to authorize ₦{amount}</Text>

                    {isProcessing ? (
                        <ActivityIndicator size="large" color={Colors.accent} style={{ marginVertical: 40 }} />
                    ) : (
                        <>
                            <View style={styles.pinDotRow}>
                                {[1, 2, 3, 4].map((_, i) => (
                                    <View key={i} style={[styles.pinDot, { backgroundColor: pin.length > i ? Colors.accent : Colors.border }]} />
                                ))}
                            </View>

                            <View style={styles.numpad}>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((item, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        onPress={() => item === 'delete' ? removeLast() : item !== '' && handleKeyPress(item)}
                                        style={styles.numBtn}
                                    >
                                        {item === 'delete' ? (
                                            <Ionicons name="backspace" size={28} color={Colors.textMain} />
                                        ) : (
                                            <Text style={[styles.numText, { color: Colors.textMain }]}>{item}</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </>
            ) : (
                <View style={styles.successContent}>
                    <View style={[styles.successIconBadge, { backgroundColor: Colors.accent }]}>
                        <Ionicons name="checkmark-done" size={50} color="#FFF" />
                    </View>
                    <Text style={[styles.successTitle, { color: Colors.textMain }]}>Transaction Successful</Text>
                    <Text style={[styles.successSub, { color: Colors.textSec }]}>
                        Your transfer of ₦{amount} to {recipientName} was completed successfully.
                    </Text>

                    <View style={styles.receiptActions}>
                        <TouchableOpacity 
                          onPress={handleFinalClose}
                          style={[styles.receiptBtn, { backgroundColor: Colors.accent }]}
                        >
                            <Ionicons name="share-social" size={20} color="#FFF" />
                            <Text style={styles.receiptBtnText}>Share Receipt</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={handleFinalClose} style={[styles.receiptBtnOutline, { borderColor: Colors.border }]}>
                            <Text style={[styles.receiptBtnText, { color: Colors.textMain }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  scrollContent: { padding: 20 },
  recipientHeader: { alignItems: 'center', marginBottom: 30 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  mainName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  subDetails: { fontSize: 13, fontWeight: '600' },
  card: { borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 20 },
  cardLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 15 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  currencySymbol: { fontSize: 24, fontWeight: '800', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 20, fontWeight: '700' },
  quickAmountGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  moneyBox: { width: '23%', paddingVertical: 10, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  moneyBoxText: { fontSize: 12, fontWeight: '700' },
  remarkInput: { fontSize: 15, fontWeight: '600', paddingVertical: 12, borderBottomWidth: 1, marginBottom: 20 },
  categoryRow: { flexDirection: 'row', gap: 12 },
  catBox: { flex: 1, height: 45, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  catText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  buttonContainer: { alignItems: 'center', marginTop: 10, marginBottom: 40 },
  confirmBtn: { height: 54, width: '80%', borderRadius: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, elevation: 6 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 },
  arrowCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  pinSheet: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, alignItems: 'center', minHeight: '65%', width: '100%' },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#cbd5e1', borderRadius: 10, marginBottom: 20 },
  closeModal: { alignSelf: 'flex-end', position: 'absolute', top: 20, right: 20 },
  pinTitle: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  pinSub: { fontSize: 14, fontWeight: '600', marginTop: 5, marginBottom: 40, textAlign: 'center' },
  pinDotRow: { flexDirection: 'row', gap: 24, marginBottom: 50 },
  pinDot: { width: 18, height: 18, borderRadius: 9 },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  numBtn: { width: '30%', height: 75, justifyContent: 'center', alignItems: 'center' },
  numText: { fontSize: 28, fontWeight: '600' },
  successContent: { alignItems: 'center', width: '100%', paddingVertical: 20 },
  successIconBadge: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 25, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  successTitle: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  successSub: { fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22, marginBottom: 40 },
  receiptActions: { width: '100%', gap: 12 },
  receiptBtn: { height: 55, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  receiptBtnOutline: { height: 55, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  receiptBtnText: { fontSize: 16, fontWeight: '700' }
});