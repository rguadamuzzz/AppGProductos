import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // redirige automáticamente a /login
}