import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect the following types of personal information when you use PetReunite:

• Contact Details: Your name and phone number when you create a pet report or register a pet profile. This is used so other users can contact you about your lost or found pet.

• Location Data: GPS coordinates when you choose to detect your current location while reporting a lost or found pet. We only collect location data when you explicitly tap the "Detect Location" button. We do not track your location in the background.

• Photos: Images you upload of pets for reports and profiles. Photos are stored locally on your device and may be displayed to other app users to help identify pets.

• Pet Information: Details about pets including breed, colour, size, markings, microchip number, medical notes, and descriptions. This information helps match lost and found pets.

• AI Matching Data: When you use the AI Matching or Scan Post features, your pet report details (breed, colour, size, markings, location, description) are sent to our AI service to find potential matches. No personal contact information is included in AI processing.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your personal information for the following purposes:

• Primary Purpose: To help reunite lost pets with their owners by displaying your reports and profiles to other app users in your area.

• AI Matching: To analyse pet descriptions and find potential matches between lost reports, found reports, and registered pet profiles. The AI provides suggestions only and does not make guaranteed matches.

• Area Alerts: To notify you when a lost or found pet is reported near your registered pet's suburb (within approximately 10km).

• Community Features: To display your comments/tips on pet reports and facilitate the reward pool system.

We do not use your personal information for advertising, marketing, or any purpose unrelated to the lost and found pet service.`,
  },
  {
    title: '3. How We Store Your Data',
    content: `• Local Storage: Your pet reports, profiles, and personal details are currently stored locally on your device using secure storage.

• Data Transmission: When using AI features, pet descriptions (not personal contact details) are transmitted securely via encrypted HTTPS connections to our servers for processing.

• Data Retention: Your data remains stored on your device until you delete it. You can delete individual reports, profiles, or all your data at any time through the app settings.`,
  },
  {
    title: '4. Sharing Your Information',
    content: `• Public Display: Pet reports (including photos, pet descriptions, first name, and phone number) are displayed to other app users to facilitate reuniting pets. By creating a report, you consent to this information being visible to other users.

• AI Processing: Pet descriptions are processed by OpenAI's AI service for matching purposes. Only pet-related details are sent — not your phone number or full contact details.

• No Third-Party Marketing: We do not sell, rent, or share your personal information with third parties for marketing or advertising purposes.

• Law Enforcement: We may disclose information if required by Australian law or in response to valid legal processes.`,
  },
  {
    title: '5. AI Usage Disclosure',
    content: `PetReunite uses artificial intelligence (AI) in the following ways:

• Pet Matching: Our AI analyses pet descriptions (breed, colour, size, markings, location) to suggest potential matches between lost reports, found reports, and registered profiles. Match results include a confidence score and reasoning.

• Online Post Scanning: The Scan Post feature uses AI to extract pet information from text you paste from social media or other websites, then matches it against existing app data.

• Important: AI matching provides suggestions only. Match confidence scores are estimates and should not be relied upon as definitive identification. Always verify matches through direct contact and physical identification of the pet.

• Data Processing: AI processing is performed by OpenAI's services. Pet descriptions are sent for analysis but are not stored by the AI service beyond the processing session.

This disclosure is provided in accordance with the Australian Privacy Act 1988, including upcoming automated decision-making transparency requirements (APP 1.7-1.8, effective December 2026).`,
  },
  {
    title: '6. Your Rights',
    content: `Under the Australian Privacy Principles, you have the right to:

• Access: Request access to the personal information we hold about you.

• Correction: Request correction of any inaccurate or incomplete personal information.

• Deletion: Delete your reports, pet profiles, and all associated personal data at any time through the app's Settings screen.

• Withdraw Consent: Revoke your consent to data collection at any time through Settings. This will delete all your stored data.

• Complaint: Lodge a complaint about our handling of your personal information. You may also complain to the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.`,
  },
  {
    title: '7. Location Data',
    content: `• We only collect your GPS location when you explicitly choose to detect your location by tapping the location button in the report form.

• We do not collect, track, or monitor your location in the background.

• Location data is used solely to set the location of your pet report on the map, helping others identify where the pet was last seen or found.

• You can manually enter a location instead of using GPS at any time.`,
  },
  {
    title: '8. Photos',
    content: `• Photos you upload are used exclusively for identifying lost and found pets.

• Photos are stored locally on your device and displayed within the app.

• By uploading a photo, you consent to it being visible to other app users.

• You can delete any photo by editing or deleting the associated report or profile.

• We do not use your photos for any purpose other than pet identification within this app.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `PetReunite is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided personal information through the app, please contact us and we will delete it promptly.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. If we make significant changes, you will be asked to review and accept the updated policy within the app. The current version is 1.0, last updated February 2026.`,
  },
  {
    title: '11. Contact Us',
    content: `If you have questions about this Privacy Policy or wish to exercise your rights, please contact us through the app's Settings screen.

For complaints about privacy handling, you may also contact the Office of the Australian Information Commissioner (OAIC):
• Website: oaic.gov.au
• Phone: 1300 363 992`,
  },
];

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 }}
      >
        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.badgeText}>Australian Privacy Act Compliant</Text>
          </View>

          <Text style={styles.lastUpdated}>Last updated: February 2026 | Version 1.0</Text>

          <Text style={styles.intro}>
            PetReunite ("we", "our", "us") is committed to protecting your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs). This policy explains how we collect, use, store, and protect your personal information.
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#059669',
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
