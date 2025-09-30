import LoadingOverlay from "@/components/LoadingOverlay";
import RootLayoutClient from "./RootLayoutClient";
import { RouteProvider } from "@/context/RouteContext";

export const metadata = {
  title: "HealthGainer – Build Muscle. Boost Energy.",
  description:
    "HealthGainer offers powerful supplements to help you bulk up and gain lean muscle mass. Trusted by fitness enthusiasts, our products support faster recovery, better stamina, and real results..",
  icons: {
    icon: "/logos.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <RootLayoutClient>
      <LoadingOverlay />
      <RouteProvider>{children}</RouteProvider>
    </RootLayoutClient>
  );
}
