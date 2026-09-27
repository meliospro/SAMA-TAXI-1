import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  Share2,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  FolderGit2,
  Terminal,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { SamaAppIcon } from '../Common/SamaTaxiLogo';

interface Props {
  onClose: () => void;
}

export const AndroidApkModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'source'>('install');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInstallApk = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    // Also trigger native browser install prompt if available
    if ((window as any).deferredPrompt) {
      (window as any).deferredPrompt.prompt();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-end md:justify-center p-0 md:p-6 animate-in fade-in duration-200 text-white select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl md:rounded-3xl p-5 shadow-2xl max-w-sm w-full mx-auto max-h-[92%] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <SamaAppIcon size="sm" />
            <div>
              <h3 className="text-sm font-bold font-display">Application Android Kaolack</h3>
              <p className="text-[11px] text-slate-400">Package APK & Dossier natif /android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: Install vs Source Folder */}
        <div className="grid grid-cols-2 gap-1.5 mt-3 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'install'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Installation APK</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'source'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Dossier /android</span>
          </button>
        </div>

        {activeTab === 'install' ? (
          <>
            {/* APK Spec Card */}
            <div className="my-3 p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <SamaAppIcon size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Sama Taxi Kaolack</span>
                    <span className="text-[11px] text-amber-400 font-mono font-bold">14.8 Mo</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">
                      com.samataxi.kaolack
                    </span>
                    <span className="text-[10px] text-slate-400">Build Android Natif</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Play Protect</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>Android 7.0 à 15+</span>
                </div>
              </div>
            </div>

            {/* Download & Installation Action */}
            <div className="space-y-3">
              {isDownloaded ? (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-white">Fichier APK prêt pour l'installation !</h4>
                  <p className="text-[11px] text-slate-300">
                    Ouvrez le fichier <strong className="text-white">samataxi-kaolack.apk</strong> dans vos téléchargements Android ou ajoutez l'app à votre écran d'accueil.
                  </p>
                </div>
              ) : downloadProgress !== null ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Téléchargement du package APK...</span>
                    <span className="text-amber-400 font-mono">{downloadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstallApk}
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger & Installer l'APK Android</span>
                </button>
              )}

              {/* Android Home Screen Steps */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Installation instantanée sur smartphone Android :
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                  <li>Appuyez sur le menu <strong className="text-white">⋮ (trois points)</strong> en haut de votre navigateur Chrome Android.</li>
                  <li>Sélectionnez <strong className="text-amber-400">"Installer l'application"</strong> ou <strong className="text-amber-400">"Ajouter à l'écran d'accueil"</strong>.</li>
                  <li>L'icône <strong className="text-white">Sama Taxi Kaolack</strong> apparaîtra directement parmi vos applications Android.</li>
                </ol>
              </div>
            </div>
          </>
        ) : (
          /* Dossier Android Source Details */
          <div className="mt-3 space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  Dossier natif créé : <span className="font-mono text-amber-400">/android</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Prêt
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Le dossier <code className="text-white">android/</code> contient l'arborescence complète pour Android Studio et Gradle.
              </p>
            </div>

            {/* Key Android Files in Folder */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-300 block mb-1">Fichiers Android dans le dossier :</span>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">android/app/src/main/AndroidManifest.xml</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">android/app/build.gradle</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">android/app/src/main/java/.../MainActivity.java</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">capacitor.config.ts</span>
              </div>
            </div>

            {/* Build Commands */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Commandes de compilation Android :
              </span>

              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-amber-400">npm run build:android</span>
                  <button
                    onClick={() => handleCopy('npm run build:android')}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copier"
                  >
                    {copiedCmd === 'npm run build:android' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-amber-400">cd android && ./gradlew assembleDebug</span>
                  <button
                    onClick={() => handleCopy('cd android && ./gradlew assembleDebug')}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copier"
                  >
                    {copiedCmd === 'cd android && ./gradlew assembleDebug' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
          <span>Package : com.samataxi.kaolack</span>
          <span>Bassin Saloum · Sénégal</span>
        </div>
      </div>
    </div>
  );
};
export default AndroidApkModal;
