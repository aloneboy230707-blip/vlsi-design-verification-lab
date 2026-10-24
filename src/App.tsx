import React, { useState, useEffect } from 'react';
import { ActiveView, UserProgressData } from './types/vlsi';
import { Navbar } from './components/layout/Navbar';
import { AppSubNav } from './components/layout/AppSubNav';
import { MobileMenu } from './components/layout/MobileMenu';
import { DashboardView } from './components/views/DashboardView';
import { DigitalLogicView } from './components/views/DigitalLogicView';
import { VerilogStudioView } from './components/views/VerilogStudioView';
import { VerificationBenchView } from './components/views/VerificationBenchView';
import { LearningLibraryView } from './components/views/LearningLibraryView';
import { InterviewPrepView } from './components/views/InterviewPrepView';
import { ProgressView } from './components/views/ProgressView';
import { SettingsView } from './components/views/SettingsView';
import { useAuth } from './context/AuthContext';
import { loadProgressFromFirestore, saveProgressToFirestore } from './firebase/firestoreService';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // User learning state (local state for Stage 1 & 2; persistent Firebase Firestore in Stage 5)
  const [progress, setProgress] = useState<UserProgressData>(() => {
    const saved = localStorage.getItem('vlsi_lab_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      completedGateQuizzes: 4,
      totalGateQuizzes: 10,
      verilogCompletedIds: ['half-adder'],
      testVectorsRunCount: 51,
      practiceStreakDays: 3,
      logicScore: 120,
      lastActiveDate: new Date().toISOString(),
      theme: 'dark',
      userName: 'ECE Student',
      targetRole: 'ASIC / FPGA Design Engineer',
    };
  });

  const { user, effectiveUid, effectiveName } = useAuth();

  // Load progress when user authentication state changes
  useEffect(() => {
    let isMounted = true;
    if (!user) {
      // In guest / offline mode, do not call Firestore; rely on localStorage
      const cached = localStorage.getItem('vlsi_lab_progress_local');
      if (cached && isMounted) {
        try {
          setProgress(JSON.parse(cached));
        } catch {
          // ignore parsing error
        }
      }
      return () => { isMounted = false; };
    }

    // Authenticated user: load from Firestore
    loadProgressFromFirestore(user.uid).then(remote => {
      if (isMounted && remote) {
        setProgress(prev => ({
          ...prev,
          logicScore: remote.logicScore ?? prev.logicScore,
          completedGateQuizzes: remote.completedGateQuizzes ?? prev.completedGateQuizzes,
          practiceStreakDays: remote.practiceStreakDays ?? prev.practiceStreakDays,
          testVectorsRunCount: remote.testVectorsRunCount ?? prev.testVectorsRunCount,
          userName: user.displayName || prev.userName,
        }));
      }
    }).catch(err => {
      console.warn('Silent progress load:', err);
    });

    return () => { isMounted = false; };
  }, [user]);

  // Sync to local storage and only push to Firestore if authenticated
  useEffect(() => {
    localStorage.setItem('vlsi_lab_progress_local', JSON.stringify(progress));
    if (user) {
      saveProgressToFirestore(user.uid, progress).catch(err => {
        console.warn('Silent progress sync to Firestore:', err);
      });
    }
  }, [progress, user]);

  const handleScoreUpdate = (points: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        logicScore: prev.logicScore + points,
        completedGateQuizzes: prev.completedGateQuizzes + 1,
      };
      if (user) {
        saveProgressToFirestore(user.uid, updated).catch(console.warn);
      }
      return updated;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Bar adhering to the Top Bar contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        setTheme={setTheme}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Secondary Sub-navigation for all 8 views */}
      <AppSubNav
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            setActiveView={setActiveView}
            progress={progress}
          />
        )}

        {activeView === 'digital-logic' && (
          <DigitalLogicView
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {activeView === 'verilog-studio' && (
          <VerilogStudioView />
        )}

        {activeView === 'verification-bench' && (
          <VerificationBenchView />
        )}

        {activeView === 'learning-library' && (
          <LearningLibraryView />
        )}

        {activeView === 'interview-prep' && (
          <InterviewPrepView />
        )}

        {activeView === 'my-progress' && (
          <ProgressView progress={progress} />
        )}

        {activeView === 'profile-settings' && (
          <SettingsView
            progress={progress}
            setProgress={setProgress}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </main>

      {/* Editorial Anti-slop Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VLSI Design & Verification Lab</span>
            <span>·</span>
            <span>ECE Placement & Technical Prep</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setActiveView('digital-logic')}
              className="hover:text-cyan-400 transition-colors"
            >
              Digital Logic
            </button>
            <button
              onClick={() => setActiveView('verilog-studio')}
              className="hover:text-cyan-400 transition-colors"
            >
              Verilog Studio
            </button>
            <button
              onClick={() => setActiveView('verification-bench')}
              className="hover:text-cyan-400 transition-colors"
            >
              Workbench
            </button>
            <button
              onClick={() => setActiveView('interview-prep')}
              className="hover:text-cyan-400 transition-colors"
            >
              Interview Prep
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
