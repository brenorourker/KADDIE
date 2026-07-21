import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppBar,
  Button,
  colors,
  Radio,
  radii,
  spacing,
  typography,
} from "@kaddie/ui";
import { usePersona } from "../../personas/PersonaProvider";
import {
  aboutMock,
  aggressionOptions,
  clubBiasOptions,
  contactTopics,
  helpArticles,
  helpTopics,
  languageOptions,
  notificationDefaults,
  notificationInbox,
  parameterDefaults,
  personalityOptions,
  preferenceSectionTitles,
  privacyDefaults,
  privacyRows,
  riskOptions,
  subscriptionMock,
  type PreferenceSectionId,
} from "./mockData";
import {
  preferenceScreenStyles,
  SettingsBodyText,
  SettingsGroup,
  SettingsRow,
  SettingsSection,
  SettingsSwitchRow,
} from "./settingsChrome";

type PreferenceSectionScreenProps = {
  sectionId: PreferenceSectionId;
  onBack: () => void;
  onOpenSection?: (sectionId: PreferenceSectionId) => void;
};

export function PreferenceSectionScreen({
  sectionId,
  onBack,
  onOpenSection,
}: PreferenceSectionScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(
    insets.bottom + spacing.xl,
    spacing["2xl"] + spacing.lg,
  );
  const title = preferenceSectionTitles[sectionId];

  return (
    <View style={preferenceScreenStyles.root}>
      <AppBar title={title} onLeadingPress={onBack} />
      <ScrollView
        contentContainerStyle={[
          preferenceScreenStyles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        style={preferenceScreenStyles.scroll}
      >
        {sectionId === "language" ? <LanguageContent /> : null}
        {sectionId === "personality" ? <PersonalityContent /> : null}
        {sectionId === "parameters" ? <ParametersContent /> : null}
        {sectionId === "subscription" ? <SubscriptionContent /> : null}
        {sectionId === "notifications" ? <NotificationsContent /> : null}
        {sectionId === "privacy" ? <PrivacyContent /> : null}
        {sectionId === "help" ? (
          <HelpContent onOpenSupportTicket={() => onOpenSection?.("contact")} />
        ) : null}
        {sectionId === "contact" ? <ContactContent /> : null}
        {sectionId === "about" ? <AboutContent /> : null}
      </ScrollView>
    </View>
  );
}

function LanguageContent() {
  const { activePersona } = usePersona();
  const initial =
    languageOptions.find(
      (option) => option.label === activePersona.data.preferences.myKaddie.language,
    )?.id ?? "en";
  const [selectedId, setSelectedId] = useState<string>(initial);

  return (
    <>
      <SettingsBodyText>
        Choose the language Kaddie uses for voice replies and on-screen copy.
      </SettingsBodyText>
      <SettingsSection label="APP LANGUAGE" />
      <SettingsGroup>
        {languageOptions.map((option, index) => (
          <SettingsRow
            key={option.id}
            isLast={index === languageOptions.length - 1}
            showChevron={false}
            supportingText={"supportingText" in option ? option.supportingText : undefined}
            title={option.label}
            trailing={
              <Radio
                accessibilityLabel={option.label}
                selected={selectedId === option.id}
                onPress={() => setSelectedId(option.id)}
              />
            }
            onPress={() => setSelectedId(option.id)}
          />
        ))}
      </SettingsGroup>
    </>
  );
}

function PersonalityContent() {
  const { activePersona } = usePersona();
  const initial =
    personalityOptions.find(
      (option) =>
        option.label === activePersona.data.preferences.myKaddie.personality,
    )?.id ?? "encouraging";
  const [selectedId, setSelectedId] = useState<string>(initial);

  return (
    <>
      <SettingsBodyText>
        Pick how Kaddie should sound when giving club advice and encouragement.
      </SettingsBodyText>
      <SettingsSection label="VOICE STYLE" />
      <SettingsGroup>
        {personalityOptions.map((option, index) => (
          <SettingsRow
            key={option.id}
            isLast={index === personalityOptions.length - 1}
            showChevron={false}
            supportingText={option.supportingText}
            title={option.label}
            trailing={
              <Radio
                accessibilityLabel={option.label}
                selected={selectedId === option.id}
                onPress={() => setSelectedId(option.id)}
              />
            }
            onPress={() => setSelectedId(option.id)}
          />
        ))}
      </SettingsGroup>
    </>
  );
}

function ParametersContent() {
  const [aggression, setAggression] = useState<string>(parameterDefaults.aggression);
  const [risk, setRisk] = useState<string>(parameterDefaults.riskTolerance);
  const [clubBias, setClubBias] = useState<string>(
    parameterDefaults.clubSelectionBias,
  );
  const [speakYardages, setSpeakYardages] = useState(
    parameterDefaults.speakYardages,
  );
  const [speakClubPicks, setSpeakClubPicks] = useState(
    parameterDefaults.speakClubPicks,
  );
  const [speakWind, setSpeakWind] = useState(parameterDefaults.speakWind);

  return (
    <>
      <SettingsBodyText>
        Tune how aggressive Kaddie plays and what it speaks out loud on the course.
      </SettingsBodyText>

      <SettingsSection label="STRATEGY" />
      <SettingsGroup>
        {aggressionOptions.map((option, index) => (
          <SettingsRow
            key={option}
            isLast={index === aggressionOptions.length - 1}
            showChevron={false}
            title={option}
            trailing={
              <Radio
                accessibilityLabel={option}
                selected={aggression === option}
                onPress={() => setAggression(option)}
              />
            }
            onPress={() => setAggression(option)}
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="RISK TOLERANCE" />
      <SettingsGroup>
        {riskOptions.map((option, index) => (
          <SettingsRow
            key={option}
            isLast={index === riskOptions.length - 1}
            showChevron={false}
            title={option}
            trailing={
              <Radio
                accessibilityLabel={option}
                selected={risk === option}
                onPress={() => setRisk(option)}
              />
            }
            onPress={() => setRisk(option)}
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="CLUB SELECTION BIAS" />
      <SettingsGroup>
        {clubBiasOptions.map((option, index) => (
          <SettingsRow
            key={option}
            isLast={index === clubBiasOptions.length - 1}
            showChevron={false}
            title={option}
            trailing={
              <Radio
                accessibilityLabel={option}
                selected={clubBias === option}
                onPress={() => setClubBias(option)}
              />
            }
            onPress={() => setClubBias(option)}
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="VOICE OUTPUT" />
      <SettingsGroup>
        <SettingsSwitchRow
          title="Speak yardages"
          value={speakYardages}
          onValueChange={setSpeakYardages}
        />
        <SettingsSwitchRow
          title="Speak club picks"
          value={speakClubPicks}
          onValueChange={setSpeakClubPicks}
        />
        <SettingsSwitchRow
          isLast
          title="Speak wind calls"
          value={speakWind}
          onValueChange={setSpeakWind}
        />
      </SettingsGroup>
    </>
  );
}

function SubscriptionContent() {
  const { activePersona } = usePersona();
  const planLabel = activePersona.data.preferences.account.subscription;
  const isPro = planLabel.toLowerCase().includes("pro");

  return (
    <>
      <SettingsSection label="CURRENT PLAN" />
      <SettingsGroup>
        <SettingsRow
          showChevron={false}
          title={isPro ? subscriptionMock.planName : "Kaddie Free"}
          value={isPro ? subscriptionMock.status : planLabel}
        />
        <SettingsRow
          showChevron={false}
          title="Price"
          value={isPro ? subscriptionMock.price : "€0"}
        />
        <SettingsRow
          isLast
          showChevron={false}
          title="Renews"
          value={isPro ? subscriptionMock.renewsOn : "—"}
        />
      </SettingsGroup>

      <SettingsSection label="INCLUDED" />
      <SettingsGroup>
        {subscriptionMock.features.map((feature, index) => (
          <SettingsRow
            key={feature}
            isLast={index === subscriptionMock.features.length - 1}
            showChevron={false}
            title={feature}
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="BILLING HISTORY" />
      <SettingsGroup>
        {subscriptionMock.billingHistory.map((item, index) => (
          <SettingsRow
            key={item.id}
            isLast={index === subscriptionMock.billingHistory.length - 1}
            showChevron={false}
            title={item.label}
            value={item.value}
          />
        ))}
      </SettingsGroup>

      <Button
        label={isPro ? "Manage subscription" : "Upgrade to Pro"}
        onPress={() =>
          Alert.alert(
            isPro ? "Manage subscription" : "Upgrade to Pro",
            "Mock action — billing is not connected yet.",
          )
        }
      />
    </>
  );
}

function NotificationsContent() {
  const [pushEnabled, setPushEnabled] = useState(notificationDefaults.pushEnabled);
  const [roundReminders, setRoundReminders] = useState(
    notificationDefaults.roundReminders,
  );
  const [tipsAndInsights, setTipsAndInsights] = useState(
    notificationDefaults.tipsAndInsights,
  );
  const [productUpdates, setProductUpdates] = useState(
    notificationDefaults.productUpdates,
  );
  const [marketing, setMarketing] = useState(notificationDefaults.marketing);

  return (
    <>
      <SettingsSection label="PREFERENCES" />
      <SettingsGroup>
        <SettingsSwitchRow
          supportingText="Master toggle for push alerts"
          title="Push notifications"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <SettingsSwitchRow
          title="Round reminders"
          value={roundReminders}
          onValueChange={setRoundReminders}
        />
        <SettingsSwitchRow
          title="Tips & insights"
          value={tipsAndInsights}
          onValueChange={setTipsAndInsights}
        />
        <SettingsSwitchRow
          title="Product updates"
          value={productUpdates}
          onValueChange={setProductUpdates}
        />
        <SettingsSwitchRow
          isLast
          title="Marketing"
          value={marketing}
          onValueChange={setMarketing}
        />
      </SettingsGroup>

      <SettingsSection label="INBOX" />
      <SettingsGroup>
        {notificationInbox.map((item, index) => (
          <SettingsRow
            key={item.id}
            isLast={index === notificationInbox.length - 1}
            showChevron={false}
            supportingText={`${item.supportingText} · ${item.time}`}
            title={item.title}
            value={item.unread ? "New" : undefined}
          />
        ))}
      </SettingsGroup>
    </>
  );
}

function PrivacyContent() {
  const [shareRoundStats, setShareRoundStats] = useState(
    privacyDefaults.shareRoundStats,
  );
  const [personalizedTips, setPersonalizedTips] = useState(
    privacyDefaults.personalizedTips,
  );
  const [analytics, setAnalytics] = useState(privacyDefaults.analytics);
  const [crashReports, setCrashReports] = useState(privacyDefaults.crashReports);

  return (
    <>
      <SettingsSection label="CONTROLS" />
      <SettingsGroup>
        <SettingsSwitchRow
          supportingText="Let friends see selected highlights"
          title="Share round stats"
          value={shareRoundStats}
          onValueChange={setShareRoundStats}
        />
        <SettingsSwitchRow
          title="Personalized tips"
          value={personalizedTips}
          onValueChange={setPersonalizedTips}
        />
        <SettingsSwitchRow
          title="Analytics"
          value={analytics}
          onValueChange={setAnalytics}
        />
        <SettingsSwitchRow
          isLast
          title="Crash reports"
          value={crashReports}
          onValueChange={setCrashReports}
        />
      </SettingsGroup>

      <SettingsSection label="PERMISSIONS & DATA" />
      <SettingsGroup>
        {privacyRows.map((row, index) => (
          <SettingsRow
            key={row.id}
            isLast={index === privacyRows.length - 1}
            supportingText={row.supportingText}
            title={row.title}
            value={"value" in row ? row.value : undefined}
            onPress={() =>
              Alert.alert(row.title, "Mock action — not connected yet.")
            }
          />
        ))}
      </SettingsGroup>
    </>
  );
}

function HelpContent({
  onOpenSupportTicket,
}: {
  onOpenSupportTicket: () => void;
}) {
  return (
    <>
      <SettingsBodyText>
        Browse common topics or jump into quick answers below.
      </SettingsBodyText>

      <SettingsSection label="TOPICS" />
      <SettingsGroup>
        {helpTopics.map((topic, index) => (
          <SettingsRow
            key={topic.id}
            isLast={index === helpTopics.length - 1}
            supportingText={topic.supportingText}
            title={topic.title}
            onPress={() =>
              Alert.alert(topic.title, "Mock help article — content coming soon.")
            }
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="QUICK ANSWERS" />
      <SettingsGroup>
        {helpArticles.map((article, index) => (
          <View
            key={article.id}
            style={[
              styles.articleRow,
              index < helpArticles.length - 1 && styles.articleBorder,
            ]}
          >
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleBody}>{article.body}</Text>
          </View>
        ))}
      </SettingsGroup>

      <Button
        label="Open a support ticket"
        onPress={onOpenSupportTicket}
      />
    </>
  );
}

function ContactContent() {
  const { activePersona } = usePersona();
  const [topicIndex, setTopicIndex] = useState(0);
  const [message, setMessage] = useState(
    "Hi Kaddie team — I’m seeing an issue with yardages on hole 5 at Elmgreen. Happy to share a screen recording.",
  );
  const email = useMemo(
    () => activePersona.data.preferences.user.email,
    [activePersona.data.preferences.user.email],
  );

  return (
    <>
      <SettingsBodyText>
        Send us a note and we’ll get back within 1–2 business days.
      </SettingsBodyText>

      <SettingsSection label="TOPIC" />
      <SettingsGroup>
        {contactTopics.map((topic, index) => (
          <SettingsRow
            key={topic}
            isLast={index === contactTopics.length - 1}
            showChevron={false}
            title={topic}
            trailing={
              <Radio
                accessibilityLabel={topic}
                selected={topicIndex === index}
                onPress={() => setTopicIndex(index)}
              />
            }
            onPress={() => setTopicIndex(index)}
          />
        ))}
      </SettingsGroup>

      <SettingsSection label="MESSAGE" />
      <View style={styles.messageCard}>
        <Text style={styles.messageMeta}>From {email}</Text>
        <TextInput
          multiline
          style={styles.messageInput}
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <Button
        label="Send message"
        onPress={() =>
          Alert.alert(
            "Message sent",
            `Mock send for “${contactTopics[topicIndex]}”. Support inbox is not connected yet.`,
          )
        }
      />
    </>
  );
}

function AboutContent() {
  const { activePersona } = usePersona();
  const version =
    activePersona.data.preferences.support.version || aboutMock.version;

  return (
    <>
      <View style={styles.aboutHero}>
        <Text style={styles.aboutName}>{aboutMock.appName}</Text>
        <Text style={styles.aboutTagline}>{aboutMock.tagline}</Text>
      </View>

      <SettingsSection label="APP INFO" />
      <SettingsGroup>
        <SettingsRow showChevron={false} title="Version" value={version} />
        <SettingsRow
          isLast
          showChevron={false}
          title="Build"
          value={aboutMock.build}
        />
      </SettingsGroup>

      <SettingsSection label="LEGAL" />
      <SettingsGroup>
        {aboutMock.legal.map((item, index) => (
          <SettingsRow
            key={item.id}
            isLast={index === aboutMock.legal.length - 1}
            title={item.title}
            onPress={() =>
              Alert.alert(item.title, "Mock document — not connected yet.")
            }
          />
        ))}
      </SettingsGroup>

      <SettingsBodyText>{aboutMock.credits}</SettingsBodyText>
    </>
  );
}

const styles = StyleSheet.create({
  articleRow: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  articleBorder: {
    borderBottomColor: colors.border.default,
    borderBottomWidth: 1,
  },
  articleTitle: {
    ...typography.bodyDefault,
    color: colors.text.primary,
  },
  articleBody: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  messageCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  messageMeta: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  messageInput: {
    ...typography.bodyDefault,
    color: colors.text.primary,
    minHeight: 120,
    padding: 0,
  },
  aboutHero: {
    gap: spacing.xs,
  },
  aboutName: {
    ...typography.headingH3,
    color: colors.text.primary,
  },
  aboutTagline: {
    ...typography.bodyDefault,
    color: colors.text.secondary,
  },
});
