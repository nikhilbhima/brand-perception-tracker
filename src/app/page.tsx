import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard for now
  // In production, this would show a landing page for non-authenticated users
  redirect('/dashboard')
}
