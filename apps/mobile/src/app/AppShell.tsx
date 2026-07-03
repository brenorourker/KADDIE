import { useState } from "react";
import { Playground } from "../playground";
import { PersonaProvider, usePersona } from "../personas/PersonaProvider";
import { AddClubScreen } from "../screens/AddClubScreen";
import { ClubDetailsScreen } from "../screens/ClubDetailsScreen";
import { CreateAccountScreen } from "../screens/CreateAccountScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LogInScreen } from "../screens/LogInScreen";
import { MyBagScreen } from "../screens/MyBagScreen";
import { OnboardingFlow } from "./OnboardingFlow";
import { PreferencesScreen } from "../screens/PreferencesScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
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

  const openProfile = (returnRoute: AppRoute) => {
    setProfileReturnRoute(returnRoute);
    setRoute("profile");
  };

  const goHome = () => setRoute("home");

  if (route === "playground") {
    return <Playground onClose={goHome} />;
  }

  if (route === "add-club") {
    return (
      <AddClubScreen
        onBack={() => setRoute("my-bag")}
        onDone={() => setRoute("my-bag")}
      />
    );
  }

  if (route === "club-details") {
    return (
      <ClubDetailsScreen
        key={selectedClubId}
        clubId={selectedClubId}
        onBack={() => setRoute("my-bag")}
        onDone={() => setRoute("my-bag")}
      />
    );
  }

  if (route === "my-bag") {
    return (
      <MyBagScreen
        onAddClub={() => setRoute("add-club")}
        onBack={() => setRoute("main")}
        onOpenClubDetails={(clubId) => {
          setSelectedClubId(clubId);
          setRoute("club-details");
        }}
      />
    );
  }

  if (route === "preferences") {
    return (
      <PreferencesScreen
        onBack={() => setRoute("main")}
        onOpenProfile={() => openProfile("preferences")}
      />
    );
  }

  if (route === "profile") {
    return (
      <ProfileScreen
        onBack={() => setRoute(profileReturnRoute)}
        onLogOut={() => setRoute("login")}
      />
    );
  }

  if (route === "main") {
    return (
      <HomeScreen
        onOpenMyBag={() => setRoute("my-bag")}
        onOpenPreferences={() => setRoute("preferences")}
        onOpenProfile={() => openProfile("main")}
      />
    );
  }

  if (route === "login") {
    return (
      <LogInScreen
        key={activePersona.id}
        onCreateAccount={() => setRoute("create-account")}
        onForgotPassword={() => setRoute("forgot-password")}
        onSignIn={() => setRoute("main")}
      />
    );
  }

  if (route === "create-account") {
    return (
      <CreateAccountScreen
        onAccountCreated={(email) => {
          setPendingVerificationEmail(email);
          setRoute("verify-email");
        }}
        onBack={() => setRoute("login")}
        onSignIn={() => setRoute("login")}
      />
    );
  }

  if (route === "verify-email") {
    return (
      <VerifyEmailScreen
        email={pendingVerificationEmail ?? activePersona.data.auth.email}
        onBack={() => setRoute("create-account")}
        onChangeEmail={() => setRoute("create-account")}
      />
    );
  }

  if (route === "onboarding" || route === "onboarding-location") {
    return (
      <OnboardingFlow
        key={activePersona.id}
        initialStep={route === "onboarding-location" ? 1 : 0}
        onClose={() => setRoute("main")}
        onComplete={() => setRoute("main")}
        onSkip={() => setRoute("main")}
      />
    );
  }

  if (route === "forgot-password") {
    return (
      <ForgotPasswordScreen
        onBack={() => setRoute("login")}
        onResetCodeSent={() => setRoute("reset-password")}
      />
    );
  }

  if (route === "reset-password") {
    return (
      <ResetPasswordScreen
        onBack={() => setRoute("login")}
        onReset={() => setRoute("login")}
      />
    );
  }

  return (
    <AppHome
      onLaunch={setRoute}
      onOpenPlayground={() => setRoute("playground")}
    />
  );
}
