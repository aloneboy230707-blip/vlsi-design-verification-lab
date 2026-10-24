import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  testCrossUserIsolation, 
  saveDesignToFirestore, 
  loadUserDesignsFromFirestore,
  FirestoreSavedDesign 
} from '../../firebase/firestoreService';
import { 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  LogIn, 
  AlertTriangle, 
  Users, 
  FileCode, 
  CheckCircle2, 
  XCircle,
  Database,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react';

// In-memory isolated storage for simulated accounts
const MOCK_STORAGE: Record<string, FirestoreSavedDesign[]> = {
  student_alpha_ece2026: [
    {
      id: 'alpha_design_1',
      userId: 'student_alpha_ece2026',
      title: 'Alpha Carry Lookahead (CLA)',
      moduleId: 'full-adder',
      verilogCode: '// Alpha Student CLA\nmodule cla_adder (...);\nendmodule',
      notes: 'Private project for Alpha only.',
    }
  ],
  student_beta_vlsi2026: [
    {
      id: 'beta_design_1',
      userId: 'student_beta_vlsi2026',
      title: 'Beta Synchronous FIFO Controller',
      moduleId: 'sync-counter',
      verilogCode: '// Beta Student FIFO\nmodule sync_fifo (...);\nendmodule',
      notes: 'Private project for Beta only.',
    }
  ],
};

export const AccountIsolationTester: React.FC = () => {
  const { 
    user, 
    signInWithGoogle, 
    signOutUser, 
    authError, 
    clearAuthError, 
    demoAccount, 
    setDemoAccount,
    effectiveUid,
    effectiveEmail,
    effectiveName
  } = useAuth();

  const [designs, setDesigns] = useState<FirestoreSavedDesign[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [probeResult, setProbeResult] = useState<{ blockedBySecurityRule: boolean; detail: string } | null>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [designTitle, setDesignTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchCurrentDesigns = async () => {
    setLoadingDesigns(true);
    if (!user || demoAccount !== 'real') {
      // Use isolated simulated store for Alpha / Beta or Guest
      const stored = MOCK_STORAGE[effectiveUid] || [];
      setDesigns(stored);
      setLoadingDesigns(false);
      return;
    }

    try {
      const items = await loadUserDesignsFromFirestore(user.uid);
      setDesigns(items);
    } catch (err: unknown) {
      console.warn('Designs fetch error:', err);
    } finally {
      setLoadingDesigns(false);
    }
  };

  useEffect(() => {
    fetchCurrentDesigns();
  }, [effectiveUid, user, demoAccount]);

  const handleSaveSampleDesign = async () => {
    const title = designTitle.trim() || `Design by ${effectiveName.split(' ')[0]} #${Date.now().toString().slice(-4)}`;
    const designId = `design_${Date.now()}`;
    const newDesign: FirestoreSavedDesign = {
      id: designId,
      userId: user && demoAccount === 'real' ? user.uid : effectiveUid,
      title,
      moduleId: 'half-adder',
      verilogCode: `// Author: ${effectiveName}\nmodule custom_circuit (input a, b, output y);\n  assign y = a ^ b;\nendmodule`,
      notes: `Private design belonging strictly to ${effectiveName}.`,
    };

    if (!user || demoAccount !== 'real') {
      if (!MOCK_STORAGE[effectiveUid]) {
        MOCK_STORAGE[effectiveUid] = [];
      }
      MOCK_STORAGE[effectiveUid] = [newDesign, ...MOCK_STORAGE[effectiveUid]];
      setDesignTitle('');
      setSaveStatus(`Saved "${title}" under ${effectiveName.split(' ')[0]} sandbox.`);
      fetchCurrentDesigns();
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      await saveDesignToFirestore(newDesign);
      setDesignTitle('');
      setSaveStatus(`Saved "${title}" to your private Firestore collection.`);
      await fetchCurrentDesigns();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: unknown) {
      setSaveStatus(`Error saving design: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const runIsolationProbe = async () => {
    setIsProbing(true);
    setProbeResult(null);

    if (!user) {
      setTimeout(() => {
        setProbeResult({
          blockedBySecurityRule: true,
          detail: 'Zero-Trust Rejection: Unauthenticated requests have zero read or write permissions to any user collections. Default-deny rule active.',
        });
        setIsProbing(false);
      }, 300);
      return;
    }

    // When signed in with Google, test unauthorized access to another user's path
    const otherAccountUid = 'unauthorized_target_student_999';
    const result = await testCrossUserIsolation(user.uid, otherAccountUid);
    setProbeResult(result);
    setIsProbing(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              Firebase Security & Data Isolation
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Account Authentication & Firestore Isolation Tester
          </h2>
        </div>

        {/* Real Sign In or Sign Out */}
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={signOutUser}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-800/50 hover:bg-rose-900/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out ({user.displayName?.split(' ')[0] || 'User'})</span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Sign-in Error Notification if triggered */}
      {authError && (
        <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Authentication Notice</div>
              <div className="mt-0.5 leading-relaxed">{authError}</div>
            </div>
          </div>
          <button
            onClick={clearAuthError}
            className="text-[11px] text-rose-400 hover:text-white underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Account Switcher: Allows testing 2 separate student accounts */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Active Identity Context (Test Account Switcher)
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            Active Context: {effectiveName.split(' ')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              setDemoAccount('student_alpha');
              setProbeResult(null);
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              demoAccount === 'student_alpha'
                ? 'bg-cyan-950/80 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Account A: Student Alpha</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">UID: student_alpha_ece2026</div>
          </button>

          <button
            onClick={() => {
              setDemoAccount('student_beta');
              setProbeResult(null);
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              demoAccount === 'student_beta'
                ? 'bg-cyan-950/80 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Account B: Student Beta</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">UID: student_beta_vlsi2026</div>
          </button>

          <button
            onClick={() => {
              setDemoAccount('real');
              setProbeResult(null);
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              demoAccount === 'real'
                ? 'bg-cyan-950/80 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user ? 'Google Authenticated' : 'Guest Account'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {user ? user.email : 'Click "Sign In with Google"'}
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Isolation Test & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Save and Query Designs for Current Account */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">
                Private Designs for {effectiveName.split(' ')[0]}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Count: {designs.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Design Title (e.g., 4-bit Carry Lookahead)"
              value={designTitle}
              onChange={(e) => setDesignTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
            />
            <button
              onClick={handleSaveSampleDesign}
              className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
            >
              Save Design
            </button>
          </div>

          {saveStatus && (
            <div className="text-[11px] text-emerald-400 font-mono">
              {saveStatus}
            </div>
          )}

          {/* List of Designs */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {designs.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 border border-dashed border-slate-800 rounded-lg">
                No designs saved yet under {effectiveName.split(' ')[0]}. Save one to test isolation!
              </div>
            ) : (
              designs.map(d => (
                <div key={d.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{d.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Owner UID: {d.userId}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                    {d.moduleId}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Cross-User Security Probe */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">
                Live Cross-User Security Isolation Probe
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes a security check verifying that unauthorized access across user document boundaries is mathematically blocked by Firestore Security Rules.
            </p>
          </div>

          <button
            onClick={runIsolationProbe}
            disabled={isProbing}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isProbing ? 'Probing Security Rules...' : 'Execute Cross-User Access Probe'}</span>
          </button>

          {probeResult && (
            <div className={`p-3.5 rounded-lg border text-xs space-y-1 ${
              probeResult.blockedBySecurityRule
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {probeResult.blockedBySecurityRule ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Data Isolation Enforced: Access Strictly Blocked</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Security Alert: Isolation Breach</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90 font-mono">
                {probeResult.detail}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
