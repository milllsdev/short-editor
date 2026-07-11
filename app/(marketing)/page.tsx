import Link from "next/link";
import {
  Captions,
  Check,
  Crop,
  MousePointer2,
  Scissors,
  Sparkles,
  Upload,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ProductPreview } from "@/components/marketing/product-preview";
import { ButtonLink } from "@/components/ui/button-link";

const features = [
  {
    icon: Scissors,
    title: "Intelligent clip selection",
    description: "Find the strongest hooks, insights, and stories across your entire recording.",
  },
  {
    icon: Captions,
    title: "Professional captions",
    description: "Add accurate, polished captions designed to hold attention without distracting from your message.",
  },
  {
    icon: Crop,
    title: "Automatic reframing",
    description: "Keep speakers centered and every clip composed naturally for a vertical canvas.",
  },
  {
    icon: MousePointer2,
    title: "Editable results",
    description: "Review every decision, refine the cut, and make each Short feel unmistakably yours.",
  },
];

const steps = [
  { number: "01", icon: Upload, title: "Add your long video", description: "Upload a podcast, interview, lesson, or talking-head recording." },
  { number: "02", icon: Sparkles, title: "Rendo finds the moments", description: "Your video is analyzed for clear ideas, strong hooks, and natural clip boundaries." },
  { number: "03", icon: Scissors, title: "Review and publish", description: "Fine-tune polished vertical clips, then export them for every social channel." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-6 sm:px-5">
        <nav className="nav-type mx-auto grid h-[58px] w-full max-w-[960px] grid-cols-[1fr_auto_1fr] items-center rounded-2xl border border-white/[0.08] bg-[#303238]/85 px-3 shadow-[0_10px_28px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[20px] sm:px-4 [&>a:first-child]:-ml-1" aria-label="Primary navigation">
          <Brand navbar />
          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-zinc-300 transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-300 transition-colors hover:text-white">How it works</a>
            <a href="#pricing" className="text-sm text-zinc-300 transition-colors hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center justify-self-end gap-2 sm:gap-3">
            <Link href="/dashboard" className="hidden px-1.5 text-sm text-zinc-300 transition-colors hover:text-white sm:block">Sign in</Link>
            <ButtonLink href="/dashboard/new" className="-mr-2 px-3.5 sm:px-[18px]" style={{ borderRadius: 13 }}>Create your first Short</ButtonLink>
          </div>
        </nav>
      </header>

      <main>
        <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Sparkles className="size-3.5 text-blue-300" />Built for creators with something to say
            </div>
            <h1 className="mx-auto max-w-[700px] text-[34px] font-medium leading-[1.04] text-white sm:text-[42px] lg:text-[52px]">
              <span className="block">Turn long videos into</span>
              <span className="block font-semibold italic">professionally edited Shorts.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Rendo finds your best moments, adds polished captions, and reframes every shot, so you can publish more without losing hours to the timeline.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/dashboard/new" className="w-full px-6 sm:w-auto">Create your first Short</ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary" className="w-full px-6 sm:w-auto">See how it works</ButtonLink>
            </div>
            <p className="mt-4 text-xs text-zinc-600">No editing experience required</p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20"><ProductPreview /></div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#0b0d10] px-5 py-16 sm:px-8" aria-label="Designed for creators">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-xs font-semibold uppercase text-zinc-600">Made for the ideas already sitting in your recordings</p>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm font-medium text-zinc-400 sm:grid-cols-5">
              {['Podcasters', 'Interviewers', 'YouTubers', 'Coaches', 'Educators'].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-16 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="A simpler workflow" title="From long-form to ready-to-share" description="Keep your attention on the story. Rendo handles the repetitive editing work around it." />
            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
              {steps.map(({ number, icon: Icon, title, description }) => (
                <div key={number} className="relative bg-[#0e1014] p-7 sm:p-8">
                  <span className="absolute right-6 top-5 text-xs font-medium text-zinc-700">{number}</span>
                  <span className="mb-8 grid size-10 place-items-center rounded-md border border-blue-400/20 bg-blue-400/10 text-blue-300"><Icon className="size-4.5" /></span>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-y border-white/[0.07] bg-[#0b0d10] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Built for the final cut" title="The details that make a Short feel finished" description="Every feature is designed to help your ideas land clearly on a vertical screen." />
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-lg border border-white/[0.08] bg-[#111318] p-7 transition-colors hover:border-white/15">
                  <span className="mb-10 grid size-10 place-items-center rounded-md bg-white/[0.05] text-blue-300"><Icon className="size-4.5" /></span>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-16 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="Simple pricing" title="Start creating without the overhead" description="A practical plan for creators publishing consistently. More options are coming as Rendo grows." />
            <div className="mx-auto mt-14 max-w-xl rounded-lg border border-blue-400/25 bg-[#111318] p-7 sm:p-9">
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-start">
                <div><p className="font-semibold text-white">Creator</p><p className="mt-1 text-sm text-zinc-500">Everything you need to turn recordings into Shorts.</p></div>
                <div className="sm:text-right"><p className="text-3xl font-semibold text-white">$24<span className="text-sm font-normal text-zinc-500"> / month</span></p><p className="mt-1 text-xs text-zinc-600">Pricing preview</p></div>
              </div>
              <ul className="grid gap-3 py-7 sm:grid-cols-2">
                {["120 processing minutes", "Professional captions", "Automatic reframing", "Editable results"].map((item) => <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300"><Check className="size-4 text-blue-300" />{item}</li>)}
              </ul>
              <ButtonLink href="/dashboard/new" className="w-full">Start your first project</ButtonLink>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#0d1015] px-5 py-20 text-center sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl"><h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">Your next great Short is already in your footage.</h2><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400">Spend less time searching through timelines and more time sharing the ideas that matter.</p><ButtonLink href="/dashboard/new" className="mt-8 px-6">Create your first Short</ButtonLink></div>
        </section>
      </main>

      <footer className="px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><Brand /><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500"><a href="#features" className="hover:text-white">Features</a><a href="#how-it-works" className="hover:text-white">How it works</a><a href="#pricing" className="hover:text-white">Pricing</a><span>Privacy</span><span>Terms</span></div><p className="text-xs text-zinc-600">© 2026 Rendo</p></div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase text-blue-300">{eyebrow}</p><h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-zinc-500">{description}</p></div>;
}
