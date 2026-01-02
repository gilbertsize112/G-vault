import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Share, ScrollView, Platform, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface ReceiptProps {
  isDark: boolean;
  amount: string;
  recipientName: string;
  bankName: string;
  accountNumber: string;
  note?: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function ReceiptScreen({ isDark, amount, recipientName, bankName, accountNumber, note, onClose }: ReceiptProps) {
  
  const Colors = {
    bg: isDark ? '#020617' : '#FFFFFF', 
    textMain: isDark ? '#F8FAFC' : '#000000',
    textSec: isDark ? '#94A3B8' : '#666666',
    accent: '#0052FF', // Updated to Fintech Blue
    border: isDark ? '#1E293B' : '#EEEEEE',
    watermark: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0, 82, 255, 0.05)', // Blue tint
    stamp: 'rgba(0, 82, 255, 0.10)', // Light blue tint for stamp
    btnBg: '#0052FF', // Blue button
    secondaryBtn: isDark ? '#1E293B' : '#F1F5F9',
  };

  const transactionDate = new Date().toLocaleString('en-GB', {
    month: 'short', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).replace(',', '');

  const transRef = `22${Math.floor(Math.random() * 1000000000000)}`;

  // Function to create the PDF with the new blue theme
  const handlePrint = async () => {
    const htmlContent = `
      <html>
        <body style="font-family: Helvetica; padding: 40px; color: #333;">
          <div style="text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 20px;">
            <h1 style="color: #0052FF; margin: 0;">G-VAULT</h1>
            <p style="font-size: 40px; font-weight: bold; margin: 20px 0; color: #0052FF;">₦${parseFloat(amount).toLocaleString()}</p>
            <p style="font-size: 18px; letter-spacing: 2px;">SUCCESS</p>
            <p style="color: #666;">${transactionDate}</p>
          </div>
          <div style="margin-top: 30px; line-height: 2;">
            <p><b>Recipient:</b> ${recipientName.toUpperCase()}</p>
            <p><b>Bank:</b> ${bankName}</p>
            <p><b>Account:</b> ${accountNumber}</p>
            <p><b>Sender:</b> DANIEL GILBERT</p>
            <p><b>Reference:</b> ${transRef}</p>
            <p><b>Remark:</b> ${note || 'Sent from G-VAULT'}</p>
          </div>
          <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
            Official Digital Receipt - G-VAULT Fintech
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Could not generate PDF");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `G-VAULT Transaction\nAmount: ₦${amount}\nRef: ${transRef}\nStatus: SUCCESS` });
    } catch (error) { console.log(error); }
  };

  const WatermarkLayer = () => (
    <View style={styles.watermarkContainer} pointerEvents="none">
      {[...Array(10)].map((_, i) => (
        <View key={i} style={[styles.watermarkRow, { marginLeft: i % 2 === 0 ? -40 : 20 }]}>
          <Text style={[styles.watermarkText, { color: Colors.watermark }]}>G-VAULT    G-VAULT    G-VAULT</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={26} color={Colors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.textMain }]}>Transaction Receipt</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color={Colors.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.receiptBody}>
          <WatermarkLayer />

          <View style={styles.topSection}>
            <View style={styles.logoRow}>
               <Ionicons name="shield-checkmark" size={24} color={Colors.accent} />
               <Text style={[styles.logoText, { color: Colors.textMain }]}>G-VAULT</Text>
            </View>
            
            <Text style={[styles.amountLabel, { color: Colors.accent }]}>
              ₦{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.successText, { color: Colors.textMain }]}>SUCCESS</Text>
            <Text style={[styles.dateText, { color: Colors.textSec }]}>{transactionDate}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: Colors.border }]} />

          <View style={styles.detailsBlock}>
            <DetailRow label="Transaction Type" value="Transfer to bank" theme={Colors} />
            
            <View style={styles.multiRow}>
              <Text style={[styles.rowLabel, { color: Colors.textSec }]}>Recipient Details</Text>
              <View style={styles.valueGroup}>
                <Text style={[styles.rowValueBold, { color: Colors.textMain }]}>{recipientName.toUpperCase()}</Text>
                <Text style={[styles.rowValueSub, { color: Colors.textSec }]}>{bankName} | {accountNumber}</Text>
              </View>
            </View>

            <View style={styles.multiRow}>
              <Text style={[styles.rowLabel, { color: Colors.textSec }]}>Sender Details</Text>
              <View style={styles.valueGroup}>
                <Text style={[styles.rowValueBold, { color: Colors.textMain }]}>DANIEL GILBERT</Text>
                <Text style={[styles.rowValueSub, { color: Colors.textSec }]}>G-VAULT | 812 345 6789</Text>
              </View>
            </View>

            <DetailRow label="Remark" value={note || "Sent from G-VAULT"} theme={Colors} />
            <DetailRow label="Transaction Reference" value={transRef} theme={Colors} />
            <DetailRow label="SessionID" value={`10000${Math.floor(Math.random() * 1000000000000000)}`} theme={Colors} />

            <View style={[styles.stampContainer, { borderColor: Colors.accent, backgroundColor: Colors.stamp }]}>
              <View style={[styles.stampInnerCircle, { borderColor: Colors.accent }]}>
                <Text style={[styles.stampText, { color: Colors.accent }]}>G-VAULT</Text>
                <Text style={[styles.stampTextBold, { color: Colors.accent }]}>APPROVED</Text>
              </View>
            </View>
          </View>

          <View style={styles.supportSection}>
            <Text style={[styles.supportLabel, { color: Colors.textSec }]}>Support</Text>
            <Text style={[styles.supportEmail, { color: Colors.accent }]}>support@g-vault.com</Text>
          </View>

          <View style={[styles.footerLine, { borderTopColor: Colors.border }]}>
            <Text style={[styles.footerNote, { color: Colors.textSec }]}>
              Enjoy a better life with G-VAULT. Licensed by the Central Bank of Nigeria and insured by the NDIC.
            </Text>
          </View>

          {/* DOWNLOAD BUTTON */}
          <TouchableOpacity 
            style={[styles.printButton, { backgroundColor: Colors.btnBg }]} 
            onPress={handlePrint}
          >
            <Ionicons name="download-outline" size={20} color="#FFF" />
            <Text style={styles.printButtonText}>Download Receipt</Text>
          </TouchableOpacity>

          {/* HOME / DONE BUTTON */}
          <TouchableOpacity 
            style={[styles.doneButton, { backgroundColor: Colors.secondaryBtn }]} 
            onPress={onClose}
          >
            <Text style={[styles.doneButtonText, { color: Colors.accent }]}>Done</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, theme }: any) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.textSec }]}>{label}</Text>
      <Text style={[styles.rowValueBold, { color: theme.textMain }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  headerTitle: { fontSize: 16, fontWeight: '500' },
  receiptBody: { paddingHorizontal: 20, paddingTop: 10 },
  watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  watermarkRow: { marginBottom: 50, transform: [{ rotate: '-25deg' }] },
  watermarkText: { fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  topSection: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, position: 'absolute', left: 0, top: 0 },
  logoText: { fontSize: 18, fontWeight: '700' },
  amountLabel: { fontSize: 32, fontWeight: '800', marginTop: 45 },
  successText: { fontSize: 16, fontWeight: '700', marginVertical: 8, letterSpacing: 1.5 },
  dateText: { fontSize: 12 },
  divider: { height: 1, width: '100%', marginBottom: 20 },
  detailsBlock: { gap: 25, position: 'relative' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  multiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rowLabel: { fontSize: 14, flex: 0.4 },
  valueGroup: { flex: 0.6, alignItems: 'flex-end' },
  rowValueBold: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  rowValueSub: { fontSize: 13, marginTop: 4, textAlign: 'right' },
  stampContainer: { position: 'absolute', right: -10, bottom: -30, width: 90, height: 90, borderRadius: 45, borderWidth: 2, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-15deg' }], padding: 2, opacity: 0.8 },
  stampInnerCircle: { width: '100%', height: '100%', borderRadius: 40, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  stampText: { fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  stampTextBold: { fontSize: 11, fontWeight: '900' },
  supportSection: { alignItems: 'center', marginTop: 70 },
  supportLabel: { fontSize: 12, marginBottom: 5 },
  supportEmail: { fontSize: 12, fontWeight: '500' },
  footerLine: { marginTop: 20, borderTopWidth: 1, borderStyle: 'dashed', paddingTop: 15, paddingBottom: 20 },
  footerNote: { fontSize: 11, lineHeight: 16, textAlign: 'left' },
  printButton: { marginTop: 10, height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  printButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  doneButton: { marginTop: 15, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  doneButtonText: { fontSize: 16, fontWeight: '700' }
});