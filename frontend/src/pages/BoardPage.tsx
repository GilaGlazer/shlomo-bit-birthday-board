import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, Cake, LogOut, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getPeople, deletePerson, getTodayBirthdays } from '../api/peopleApi';
import { logout as logoutApi } from '../api/authApi';
import { Person } from '../types';
import useAuthStore from '../store/authStore';
import TodayBanner from '../components/TodayBanner';
import PersonModal from '../components/PersonModal';
import Pagination from '../components/Pagination';
import {
  getAge,
  getDaysUntilBirthday,
  formatBirthDate,
  getAvatarColor,
} from '../utils/dateUtils';

const LIMIT = 8;

export default function BoardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  const [modal, setModal] = useState<{ open: boolean; person: Person | null }>({
    open: false,
    person: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['people', page, debouncedSearch],
    queryFn: () => getPeople(page, LIMIT, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const { data: todayBirthdays = [] } = useQuery({
    queryKey: ['today-birthdays'],
    queryFn: getTodayBirthdays,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePerson,
    onSuccess: () => {
      toast.success('Person removed');
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['today-birthdays'] });
      setDeleteConfirm(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleLogout = async () => {
    try { await logoutApi(); } catch { /* ignore */ }
    logout();
    navigate('/');
  };

  const filteredPeople = data?.data ?? [];

  const DaysBadge = ({ birthDate, isToday }: { birthDate: string; isToday: boolean }) => {
    if (isToday)
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
          🎂 Today!
        </span>
      );
    const days = getDaysUntilBirthday(birthDate);
    if (days <= 7)
      return (
        <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">
          🔥 In {days}d
        </span>
      );
    if (days <= 30)
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full">
          📅 In {days}d
        </span>
      );
    return (
      <span className="text-zinc-600 text-xs">In {days}d</span>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Cake size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">Birthday Board</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-1.5 transition-all"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Today's Birthdays */}
        <section>
          <TodayBanner />
        </section>

        {/* People list */}
        <section>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 flex-1">
              <h2 className="text-lg font-bold text-white whitespace-nowrap">Everyone</h2>
              {data && (
                <span className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2.5 py-0.5">
                  {data.pagination.total}
                </span>
              )}
              {/* Search */}
              <div className="relative max-w-xs w-full hidden sm:block">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by name..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={() => setModal({ open: true, person: null })}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500
                         text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-violet-600/25
                         active:scale-[0.97] transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              Add Person
            </button>
          </div>

          {/* Table card */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-violet-500" />
              </div>
            ) : filteredPeople.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-3">🎂</div>
                <p className="text-zinc-400 font-medium">No people yet</p>
                <p className="text-zinc-600 text-sm mt-1">Add someone to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {filteredPeople.map((person, i) => (
                  <div
                    key={person.id}
                    className="person-row flex items-center gap-4 px-5 py-3.5 group"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(person.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm truncate">{person.name}</span>
                        <DaysBadge
                          birthDate={person.birthDate}
                          isToday={todayBirthdays.some((p) => p.id === person.id)}
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatBirthDate(person.birthDate)} · Age {getAge(person.birthDate)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal({ open: true, person })}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>

                      {deleteConfirm === person.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteMutation.mutate(person.id)}
                            disabled={deleteMutation.isPending}
                            className="text-xs px-2 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all font-medium"
                          >
                            {deleteMutation.isPending ? '...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs px-2 py-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(person.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              limit={data.pagination.limit}
              onPage={(p) => setPage(p)}
            />
          )}
        </section>
      </main>

      {/* Modal */}
      {modal.open && (
        <PersonModal
          person={modal.person}
          onClose={() => setModal({ open: false, person: null })}
        />
      )}
    </div>
  );
}
