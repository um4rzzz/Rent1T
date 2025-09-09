import { ButtonTest } from '@/components/ButtonTest';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeSync } from '@/components/ThemeSync';

export default function TestPage() {
  return (
    <>
      <ThemeSync />
      <Header />
      <ButtonTest />
      <Footer />
    </>
  );
}
