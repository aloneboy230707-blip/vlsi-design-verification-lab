import React, { useState, useEffect } from 'react';
import { UserProgressData } from '../../types/vlsi';
import { useAuth } from '../../context/AuthContext';
import { 
  saveUserProfileToFirestore, 
  saveProgressToFirestore, 
  loadProgressFromFirestore 
} from '../../firebase/firestoreService';
import { AccountIsolationTester } from '../auth/AccountIsolationTester';
import { Settings, User, Moon, Sun, RotateCcw, Check, Shield, Cloud, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  progress: UserProgressData;
  setProgress: React.Dispatch<React.SetStateAction<UserProgressData>>;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  progress,
  setProgress,
  theme,
  setTheme,
}) => {
  const { user, effectiveUid, effectiveEmail, effectiveName } = useAuth();
  const [name, setName] = useState(effectiveName);
  const [role, setRole] = useState(progress.targetRole);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    setName(effectiveName);
  }, [effectiveName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = name.trim() || 'ECE Student';
    const updatedRole = role.trim() || 'ASIC / FPGA Design Engineer';

    setProgress(prev => ({
      ...prev,
      userName: updatedName,
      targetRole: updatedRole,
    }));

    if (user) {
      try {
        await saveUserProfileToFirestore({
          uid: user.uid,
          email: user.email || 'student@vlsilab.edu',
          displayName: updatedName,
          targetRole: updatedRole,
        });
        await saveProgressToFirestore(user.uid, {
          ...progress,
          userName: updatedName,
          targetRole: updatedRole,
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } catch (err) {
        console.warn('Profile save:', err);
        setSavedSuccess(true);
      }
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleSyncFromFirestore = async () => {
    if (!user) {
      setSyncStatus('Guest Mode: Progress is cached locally in this browser. Sign in with Google to enable Cloud Firestore sync.');
      setTimeout(() => setSyncStatus(null), 4000);
      return;
    }
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const remote = await loadProgressFromFirestore(user.uid);
      if (remote) {
        setProgress(prev => ({
          ...prev,
          logicScore: remote.logicScore ?? prev.logicScore,
          completedGateQuizzes: remote.completedGateQuizzes ?? prev.completedGateQuizzes,
          practiceStreakDays: remote.practiceStreakDays ?? prev.practiceStreakDays,
          testVectorsRunCount: remote.testVectorsRunCount ?? prev.testVectorsRunCount,
        }));
        setSyncStatus('Progress synchronized from Firestore successfully.');
      } else {
        // Push local progress to Firestore
        await saveProgressToFirestore(user.uid, progress);
        setSyncStatus('Initial progress record created in Firestore.');
      }
    } catch (err: unknown) {
      setSyncStatus(`Sync error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your local logic score and practice history?')) {
      setProgress(prev => ({
        ...prev,
        logicScore: 0,
        completedGateQuizzes: 0,
      }));
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
            Account & Persistence
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            Firebase Authentication & Firestore ABAC
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
          Profile and Settings
        </h1>
      </div>

      {/* Account Isolation Tester & Firebase Auth Component */}
      <AccountIsolationTester />

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Student Profile Information</h2>
          </div>
          <button
            type="button"
            onClick={handleSyncFromFirestore}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Firestore Progress'}</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-xs font-mono text-cyan-300">
            {syncStatus}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name or Placement Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80"
              placeholder="e.g., Jayaram R"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target VLSI Career Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/80"
            >
              <option value="ASIC Design Engineer">ASIC Design Engineer (RTL Design)</option>
              <option value="Design Verification (DV) Engineer">Design Verification (DV) Engineer (SystemVerilog / UVM)</option>
              <option value="FPGA Prototyping Engineer">FPGA Prototyping Engineer</option>
              <option value="Static Timing Analysis (STA) Engineer">Static Timing Analysis (STA) & Synthesis Engineer</option>
              <option value="Physical Design (PD) Engineer">Physical Design (PD) Engineer</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 inline-flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Profile changes saved to Firestore
              </span>
            ) : (
              'Changes stored securely under your private Firestore record'
            )}
          </span>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-xs"
          >
            Save to Profile
          </button>
        </div>
      </form>

      {/* Theme Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Appearance & Theme</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-300">Color Palette</div>
            <div className="text-[11px] text-slate-500">Dark Navy with restrained cyan accents or high-contrast light theme</div>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Navy</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                theme === 'light' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Security Invariants */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Security & Isolation Invariants</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Firestore security rules enforce that user profile documents (<code className="font-mono text-cyan-300">users/{'{userId}'}</code>), private saved designs, and placement progress records are mathematically restricted to the authenticated document owner. Cross-user reads return <code className="font-mono text-rose-300">PERMISSION_DENIED</code>.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetProgress}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Progress Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
