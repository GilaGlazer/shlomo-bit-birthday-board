import { useQuery } from '@tanstack/react-query';
import { Sparkles, PartyPopper } from 'lucide-react';
import { getTodayBirthdays } from '../api/peopleApi';
import { getAge, getAvatarColor } from '../utils/dateUtils';

export default function TodayBanner() {
  const { data: people = [], isLoading } = useQuery({
    queryKey: ['today-birthdays'],
    queryFn: getTodayBirthdays,
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 animate-pulse">
        <div className="h-5 w-48 bg-zinc-800 rounded mb-4" />
        <div className="flex gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 w-48 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0">
          📅
        </div>
        <div>
          <p className="font-semibold text-zinc-300">No birthdays today</p>
          <p className="text-sm text-zinc-600">Check back tomorrow — someone might be celebrating!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden today-glow">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 via-yellow-950/60 to-zinc-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.12),transparent_60%)]" />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border border-amber-500/20" />

      {/* Sparkle decorations */}
      <span className="absolute top-3 right-6 text-amber-400 text-xl animate-pulse-slow">✦</span>
      <span className="absolute top-8 right-14 text-amber-500 text-sm animate-pulse-slow" style={{ animationDelay: '0.5s' }}>✦</span>
      <span className="absolute bottom-4 left-6 text-amber-400/60 text-xs animate-pulse-slow" style={{ animationDelay: '1s' }}>✦</span>

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20">
            <PartyPopper size={16} className="text-amber-400" />
          </div>
          <h2 className="font-bold text-lg gradient-text-gold">Today's Birthdays</h2>
          <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/25 rounded-full px-2.5 py-0.5">
            <Sparkles size={11} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold">{people.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-3 bg-black/25 backdrop-blur-sm border border-amber-500/15 rounded-xl px-4 py-3 min-w-[200px]"
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(person.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
              >
                {person.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{person.name}</p>
                <p className="text-amber-400/80 text-xs">
                  🎂 Turning {getAge(person.birthDate)} today!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
