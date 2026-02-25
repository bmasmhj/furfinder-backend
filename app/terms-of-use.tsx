import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By downloading, installing, or using PetReunite ("the App"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the App.

These terms are governed by the laws of Australia, including the Australian Consumer Law.`,
  },
  {
    title: '2. Description of Service',
    content: `PetReunite is a community-based mobile application that helps users report and find lost and found pets. The App provides:

• A platform to create lost and found pet reports with photos and locations
• Pet profile registration for proactive identification
• AI-powered matching suggestions between reports and profiles
• Community features including tips, comments, and reward pooling
• Area-based alerts for nearby lost/found pet activity
• A directory of nearby vets, shelters, and rescue organisations`,
  },
  {
    title: '3. User Responsibilities',
    content: `By using the App, you agree to:

• Provide accurate and truthful information in your reports and profiles
• Only post reports about genuinely lost or found pets
• Not use the App for fraudulent, misleading, or illegal purposes
• Not post offensive, inappropriate, or harmful content
• Respect the privacy of other users and their contact information
• Not use contact information obtained through the App for any purpose other than reuniting pets
• Report any misuse or suspicious activity you encounter`,
  },
  {
    title: '4. Account & Data',
    content: `• You are responsible for the information you submit through the App
• You may delete your reports, profiles, and personal data at any time through the App's Settings
• We reserve the right to remove content that violates these terms
• Data is stored locally on your device; we recommend keeping your device secure`,
  },
  {
    title: '5. AI Matching Disclaimer',
    content: `• The AI matching feature provides suggestions only and does not guarantee the identity of any pet
• Match confidence scores are estimates based on textual analysis of pet descriptions
• You should always verify any potential match through direct contact, physical identification, and where possible, microchip verification
• PetReunite is not liable for any incorrect matches or outcomes resulting from AI suggestions
• AI processing is performed by third-party services (OpenAI) and is subject to their terms of service`,
  },
  {
    title: '6. Reward Pool',
    content: `• The reward pool feature allows users to indicate willingness to contribute toward a reward for finding a lost pet
• Reward contributions displayed in the App are pledges of intent only
• PetReunite does not process, collect, or guarantee any financial transactions
• Any financial arrangements between users are made directly between the parties involved
• PetReunite bears no responsibility for the fulfilment of reward pledges`,
  },
  {
    title: '7. Community Tips & Comments',
    content: `• Users may post tips and comments on pet reports to help the community
• You are responsible for the content of your comments
• Do not post personal attacks, spam, or misleading information
• PetReunite reserves the right to remove comments that violate these terms
• Tips and sightings are user-submitted and not verified by PetReunite`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by Australian law:

• PetReunite is provided "as is" without warranties of any kind
• We do not guarantee that the App will result in finding a lost pet
• We are not liable for any loss, damage, or injury arising from the use of the App
• We are not responsible for the actions of other users
• We are not liable for any inaccuracies in user-submitted information
• Nothing in these terms excludes or limits consumer guarantees under the Australian Consumer Law`,
  },
  {
    title: '9. Intellectual Property',
    content: `• The App's design, code, and branding are the property of PetReunite
• User-submitted content (photos, descriptions) remains the property of the user
• By submitting content, you grant PetReunite a non-exclusive licence to display it within the App for the purpose of the lost and found pet service
• You may revoke this licence by deleting your content from the App`,
  },
  {
    title: '10. Subscription & Premium Features',
    content: `• Some features require a Premium subscription ($4.99/month or $49.99/year)
• Subscriptions are processed through the Apple App Store or Google Play Store
• Subscription terms, billing, and cancellation are governed by the respective app store's policies
• You may cancel your subscription at any time through your app store settings
• Refunds are subject to the app store's refund policy and Australian Consumer Law`,
  },
  {
    title: '11. Termination',
    content: `• You may stop using the App at any time by deleting it from your device
• We may suspend or terminate access to the App if you violate these terms
• Upon termination, your locally stored data remains on your device unless you delete it`,
  },
  {
    title: '12. Changes to Terms',
    content: `We may update these Terms of Use from time to time. If we make significant changes, you will be notified within the App and asked to accept the updated terms. Continued use of the App after changes constitutes acceptance.

Current version: 1.0 | Last updated: February 2026`,
  },
  {
    title: '13. Governing Law',
    content: `These terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the jurisdiction of the courts of New South Wales.`,
  },
  {
    title: '14. Contact',
    content: `For questions about these Terms of Use, please contact us through the App's Settings screen.`,
  },
];

export default function TermsOfUseScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 }}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: February 2026 | Version 1.0</Text>

          <Text style={styles.intro}>
            Welcome to PetReunite. Please read these Terms of Use carefully before using the App. These terms set out the rules and conditions for using our service.
          </Text>

          {SECTIONS.map((section, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginBottom: 16,
  },
  intro: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
