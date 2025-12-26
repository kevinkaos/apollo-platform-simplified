import { redirect } from 'next/navigation';

// Redirect root to default module
export default function RootPage() {
  redirect('/employees/list');
}
