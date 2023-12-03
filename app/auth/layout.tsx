export const metadata = {
  title: 'Secure Authentication ',
  description: 'Sign in to get access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="root">{children}</div>;
}
