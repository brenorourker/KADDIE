import { useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Playground } from "../playground";
import { PersonaProvider, usePersona } from "../personas/PersonaProvider";
import { AddClubScreen } from "../screens/AddClubScreen";
import { ClubDetailsScreen } from "../screens/ClubDetailsScreen";
import { CreateAccountScreen } from "../screens/CreateAccountScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { InRoundShell } from "../screens/in-round/InRoundShell";
import { LogInScreen } from "../screens/LogInScreen";
import { MyBagScreen } from "../screens/MyBagScreen";
import { OnboardingFlow } from "./OnboardingFlow";
import { PreferencesScreen } from "../screens/PreferencesScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { type RoundConfig } from "../screens/roundConfig";
import { VerifyEmailScreen } from "../screens/VerifyEmailScreen";
import { AppHome } from "./AppHome";
import { resolveInitialRoute } from "./resolveInitialRoute";
import type { AppRoute } from "./routes";

export function AppShell() {
  return (
    <PersonaProvider>
      <AppShellContent />
    </PersonaProvider>
  );
}

function AppShellContent() {
  const { activePersona } = usePersona();
  const [route, setRoute] = useState<AppRoute>(() =>
    resolveInitialRoute(undefined, { devLauncher: __DEV__ }),
  );
  const [profileReturnRoute, setProfileReturnRoute] = useState<AppRoute>("main");
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(
    null,
  );
  const [selectedClubId, setSelectedClubId] = useState("driver");
  const [activeRoundConfig, setActiveRoundConfig] = useState<RoundConfig>(
    () => activePersona.data.round,
  );
  const [hasActiveRound, setHasActiveRound] = useState(false);
  const [roundSessionKey, setRoundSessionKey] = useState(0);

  const launchRoute = (nextRoute: AppRoute) => {
    if (nextRoute === "round") {
      setActiveRoundConfig(activePersona.data.round);
      setRoundSessionKey((key) => key + 1);
      setHasActiveRound(true);
    }
    setRoute(nextRoute);
  };

  const openProfile = (returnRoute: AppRoute) => {
    setProfileReturnRoute(returnRoute);
    setRoute("profile");
  };

  const goHome = () => setRoute("home");

  const startRound = (config: RoundConfig) => {
    setActiveRoundConfig(config);
    setRoundSessionKey((key) => key + 1);
    setHasActiveRound(true);
    setRoute("round");
  };

  const resumeRound = () => setRoute("round");

  const leaveRound = () => setRoute("main");

  const endRound = () => {
    setHasActiveRound(false);
    setRoute("main");
  };

  let screen: ReactNode = null;

  if (route === "playground") {
    screen = <Playground onClose={goHome} />;
  } else if (route === "add-club") {
    screen = (
      <AddClubScreen
        onBack={() => setRoute("my-bag")}
        onDone={() => setRoute("my-bag")}
      />
    );
  } else if (route === "club-details") {
    screen = (
      <ClubDetailsScreen
        key={selectedClubId}
        clubId={selectedClubId}
        onBack={() => setRoute("my-bag")}
        onDone={() => setRoute("my-bag")}
      />
    );
  } else if (route === "my-bag") {
    screen = (
      <MyBagScreen
        onAddClub={() => setRoute("add-club")}
        onBack={() => setRoute("main")}
        onOpenClubDetails={(clubId) => {
          setSelectedClubId(clubId);
          setRoute("club-details");
        }}
      />
    );
  } else if (route === "preferences") {
    screen = (
      <PreferencesScreen
        onBack={() => setRoute("main")}
        onOpenProfile={() => openProfile("preferences")}
      />
    );
  } else if (route === "profile") {
    screen = (
      <ProfileScreen
        onBack={() => setRoute(profileReturnRoute)}
        onLogOut={() => {
          setHasActiveRound(false);
          setRoute("login");
        }}
      />
    );
  } else if (route === "main") {
    screen = (
      <HomeScreen
        canResumeRound={hasActiveRound}
        resumeRoundConfig={hasActiveRound ? activeRoundConfig : undefined}
        onOpenMyBag={() => setRoute("my-bag")}
        onOpenPreferences={() => setRoute("preferences")}
        onOpenProfile={() => openProfile("main")}
        onResumeRound={resumeRound}
        onStartRound={startRound}
      />
    );
  } else if (route === "login") {
    screen = (
      <LogInScreen
        key={activePersona.id}
        onCreateAccount={() => setRoute("create-account")}
        onForgotPassword={() => setRoute("forgot-password")}
        onSignIn={() => setRoute("main")}
      />
    );
  } else if (route === "create-account") {
    screen = (
      <CreateAccountScreen
        onAccountCreated={(email) => {
          setPendingVerificationEmail(email);
          setRoute("verify-email");
        }}
        onBack={() => setRoute("login")}
        onSignIn={() => setRoute("login")}
      />
    );
  } else if (route === "verify-email") {
    screen = (
      <VerifyEmailScreen
        email={pendingVerificationEmail ?? activePersona.data.auth.email}
        onBack={() => setRoute("create-account")}
        onChangeEmail={() => setRoute("create-account")}
      />
    );
  } else if (route === "onboarding" || route === "onboarding-location") {
    screen = (
      <OnboardingFlow
        key={activePersona.id}
        initialStep={route === "onboarding-location" ? 1 : 0}
        onClose={() => setRoute("main")}
        onComplete={() => setRoute("main")}
        onSkip={() => setRoute("main")}
      />
    );
  } else if (route === "forgot-password") {
    screen = (
      <ForgotPasswordScreen
        onBack={() => setRoute("login")}
        onResetCodeSent={() => setRoute("reset-password")}
      />
    );
  } else if (route === "reset-password") {
    screen = (
      <ResetPasswordScreen
        onBack={() => setRoute("login")}
        onReset={() => setRoute("login")}
      />
    );
  } else if (route !== "round") {
    screen = (
      <AppHome
        onLaunch={launchRoute}
        onOpenPlayground={() => setRoute("playground")}
      />
    );
  }

  return (
    <View style={styles.root}>
      {hasActiveRound ? (
        <View
          pointerEvents={route === "round" ? "auto" : "none"}
          style={[
            styles.layer,
            route === "round" ? styles.layerActive : styles.layerPaused,
          ]}
        >
          <InRoundShell
            key={roundSessionKey}
            isActive={route === "round"}
            roundConfig={activeRoundConfig}
            onLeaveRound={leaveRound}
            onEndRound={endRound}
            onLogOut={() => {
              setHasActiveRound(false);
              setRoute("login");
            }}
            onUpdateRoundConfig={setActiveRoundConfig}
          />
        </View>
      ) : null}

      {route !== "round" && screen ? (
        <View style={styles.layer}>{screen}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  layer: {
    flex: 1,
  },
  layerActive: {
    zIndex: 1,
  },
  /** Keep the round mounted without display:none (breaks presses on web after resume). */
  layerPaused: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 0,
  },
});
