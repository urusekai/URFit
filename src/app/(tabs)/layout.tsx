import { TabShell } from "@/components/layout/TabShell";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return <TabShell>{children}</TabShell>;
}
