import { Captions, Check, Play, Scissors, Sparkles } from "lucide-react";

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-6xl" aria-label="Rendo product preview">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#101217] shadow-2xl shadow-black/50">
        <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-zinc-600" />
            <span className="size-2 rounded-full bg-zinc-600" />
            <span className="size-2 rounded-full bg-zinc-600" />
          </div>
          <span className="text-xs font-medium text-zinc-500">Founder Stories - Episode 08</span>
          <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">Saved</span>
        </div>

        <div className="grid min-h-[420px] lg:grid-cols-[210px_1fr_250px]">
          <aside className="hidden border-r border-white/10 p-4 lg:block">
            <p className="mb-3 text-[11px] font-semibold uppercase text-zinc-500">Generated clips</p>
            {[
              ["The lesson nobody tells you", "00:42", true],
              ["Why the first version failed", "00:31", false],
              ["Build for the customer", "00:48", false],
            ].map(([title, time, active], index) => (
              <div key={String(title)} className={`mb-2 rounded-md border p-3 ${active ? "border-blue-400/40 bg-blue-400/10" : "border-white/[0.07] bg-white/[0.02]"}`}>
                <div className="mb-4 flex items-center justify-between text-[10px] text-zinc-500"><span>0{index + 1}</span><span>{time}</span></div>
                <p className="text-xs leading-5 text-zinc-200">{title}</p>
              </div>
            ))}
          </aside>

          <div className="flex flex-col bg-[#0c0e12] p-5 sm:p-7">
            <div className="mx-auto flex w-full max-w-[252px] flex-1 items-center">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-md border border-white/10 bg-[#22262e]">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(145deg,#384052,#20242c)]" />
                <div className="absolute left-1/2 top-[26%] size-24 -translate-x-1/2 rounded-full bg-[#a97d68]" />
                <div className="absolute left-1/2 top-[43%] h-36 w-44 -translate-x-1/2 rounded-t-[42px] bg-[#273b55]" />
                <div className="absolute inset-x-5 bottom-[18%] text-center text-[15px] font-bold uppercase leading-tight text-white [text-shadow:0_2px_6px_#000]">
                  The best products start with a <span className="text-blue-300">real problem.</span>
                </div>
                <button className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[var(--button-radius)] border border-white/15 bg-black/55" aria-label="Play preview">
                  <Play className="ml-0.5 size-4 fill-white" />
                </button>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-md border border-white/10 bg-[#151820] px-3 py-2.5">
              <button aria-label="Play timeline" className="grid size-7 place-items-center rounded-[var(--button-radius)] bg-white text-black"><Play className="size-3 fill-black" /></button>
              <span className="text-[11px] text-zinc-400">00:12 / 00:42</span>
              <div className="relative h-1 flex-1 rounded bg-zinc-700"><span className="absolute inset-y-0 left-0 w-[32%] rounded bg-blue-400" /></div>
              <Scissors className="size-4 text-zinc-500" />
            </div>
          </div>

          <aside className="hidden border-l border-white/10 p-4 lg:block">
            <p className="mb-4 text-[11px] font-semibold uppercase text-zinc-500">Clip settings</p>
            <div className="space-y-4">
              <PreviewSetting icon={<Captions className="size-4" />} label="Captions" value="Bold highlight" />
              <PreviewSetting icon={<Sparkles className="size-4" />} label="Smart reframe" value="Active speaker" />
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="mb-3 flex items-center justify-between"><span className="text-xs text-zinc-400">Clip score</span><span className="text-xs font-semibold text-emerald-300">92 / 100</span></div>
              {["Strong hook", "Clear insight", "Good pacing"].map((label) => <div key={label} className="mb-2 flex items-center gap-2 text-xs text-zinc-400"><Check className="size-3.5 text-emerald-400" />{label}</div>)}
            </div>
          </aside>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-x-10 -bottom-10 -z-10 h-36 bg-blue-500/10 blur-3xl" />
    </div>
  );
}

function PreviewSetting({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-md border border-white/[0.08] bg-white/[0.025] p-3"><div className="mb-2 flex items-center gap-2 text-zinc-300">{icon}<span className="text-xs font-medium">{label}</span></div><p className="text-[11px] text-zinc-500">{value}</p></div>;
}
