import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Curriculum } from "../components/Curriculum";
import { Audience } from "../components/Audience";
import { Schedule } from "../components/Schedule";
import { Instructors } from "../components/Instructors";
import { Registration } from "../components/Registration";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <Curriculum />
        <Audience />
        <Schedule />
        <Instructors />
        <Registration />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
