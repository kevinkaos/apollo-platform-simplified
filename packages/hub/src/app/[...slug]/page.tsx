import { redirect } from 'next/navigation';

// Redirect root to default module
export default function HomePage() {
  redirect('/employees/list');
}
