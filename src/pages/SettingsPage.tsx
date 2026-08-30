import { useState, useRef, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Download,
  HardDrive,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Upload,
  User,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { useTracker, type ExportPayload } from '../hooks/useTracker'

export function SettingsPage() {
  const { user, signOut, deleteAccount } = useAuth()
  const { exportData, importData, clearAllData, progressByProblem, streakDates } = useTracker()
  const navigate = useNavigate()

  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [clearModalOpen, setClearModalOpen] = useState(false)
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const solvedCount = Array.from(progressByProblem.values()).filter((p) => p.status === 'solved').length
  const attemptedCount = Array.from(progressByProblem.values()).filter((p) => p.status === 'attempted').length

  // Export JSON handler
  const handleExport = () => {
    const payload = exportData()
    const jsonStr = JSON.stringify(payload, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `traindsa-backup-${dateStr}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import JSON handler
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null)
    setImportError(null)
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as ExportPayload
      const res = await importData(parsed)
      if (res.success) {
        setImportStatus(`Successfully restored ${res.count} problem progress entries.`)
      } else {
        setImportError(res.error || 'Failed to restore backup')
      }
    } catch {
      setImportError('Invalid JSON file format. Please choose a valid TrainDSA backup file.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Clear data handler
  const handleClearData = async () => {
    setBusy(true)
    setActionError(null)
    try {
      await clearAllData()
      setClearModalOpen(false)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to clear data')
    } finally {
      setBusy(false)
    }
  }

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return
    setBusy(true)
    setActionError(null)

    const err = await deleteAccount()
    setBusy(false)

    if (err) {
      setActionError(err)
    } else {
      setDeleteAccountModalOpen(false)
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <header className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Settings & Data</h1>
        <p className="text-sm text-muted">
          Manage your account, cloud synchronization, and local progress backups.
        </p>
      </header>

      {actionError && (
        <p className="rounded-2xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm text-hard">
          {actionError}
        </p>
      )}

      {/* Account & Sync Status Card */}
      <section className="rounded-3xl border border-line bg-panel p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-dim border border-gold/30 text-gold shrink-0">
              {user ? <Cloud className="size-6" /> : <HardDrive className="size-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {user ? 'Cloud Synced Account' : 'Guest Mode (Local Only)'}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    user
                      ? 'border border-easy/40 bg-easy/10 text-easy'
                      : 'border border-gold/40 bg-gold-dim text-gold'
                  }`}
                >
                  {user ? 'Online Sync' : 'Offline Mode'}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted max-w-xl">
                {user
                  ? `Signed in as ${user.email}. Your progress, notes, and streaks are backed up to the cloud.`
                  : 'You are currently using TrainDSA locally. All progress is saved in your browser storage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-4 py-2 text-xs font-semibold text-muted hover:text-hard hover:border-hard/40 transition cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-canvas shadow-xs transition hover:opacity-90 active:scale-95"
              >
                <User className="size-3.5" />
                <span>Sign In to Sync</span>
              </Link>
            )}
          </div>
        </div>

        {/* Current Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-line/60">
          <div className="rounded-2xl border border-line/60 bg-canvas/40 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Solved</span>
            <p className="font-serif text-xl font-bold text-ink">{solvedCount} problems</p>
          </div>
          <div className="rounded-2xl border border-line/60 bg-canvas/40 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Attempted</span>
            <p className="font-serif text-xl font-bold text-gold">{attemptedCount} problems</p>
          </div>
          <div className="rounded-2xl border border-line/60 bg-canvas/40 p-3 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Active Days</span>
            <p className="font-serif text-xl font-bold text-easy">{streakDates.length} recorded</p>
          </div>
        </div>
      </section>

      {/* Backup & Restore Section */}
      <section className="rounded-3xl border border-line bg-panel p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink flex items-center gap-2">
            <Download className="size-5 text-gold" />
            <span>Backup & Restore Data</span>
          </h2>
          <p className="mt-1 text-xs text-muted">
            Export a snapshot of all your solved problems, code snippets, and notes as a portable JSON file.
          </p>
        </div>

        {importStatus && (
          <p className="rounded-xl border border-easy/40 bg-easy/10 px-3.5 py-2 text-xs text-easy flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{importStatus}</span>
          </p>
        )}

        {importError && (
          <p className="rounded-xl border border-hard/40 bg-hard/10 px-3.5 py-2 text-xs text-hard">
            {importError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export JSON button */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-xs font-semibold text-ink hover:border-gold/40 hover:text-gold transition cursor-pointer shadow-xs"
          >
            <Download className="size-4 text-gold" />
            <span>Export Backup (.JSON)</span>
          </button>

          {/* Import JSON input */}
          <label className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-4 py-2.5 text-xs font-semibold text-ink hover:border-gold/40 hover:text-gold transition cursor-pointer shadow-xs">
            <Upload className="size-4 text-gold" />
            <span>Restore Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={(e) => void handleFileChange(e)}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="rounded-3xl border border-hard/30 bg-hard/5 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-hard">
          <ShieldAlert className="size-5" />
          <h2 className="font-serif text-xl font-semibold">Danger Zone</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-hard/20">
          <div>
            <p className="text-sm font-semibold text-ink">
              {user ? 'Permanently Delete Account' : 'Reset All Local Progress'}
            </p>
            <p className="text-xs text-muted max-w-xl mt-0.5">
              {user
                ? 'Completely delete your account and all associated cloud data from Supabase. This action cannot be undone.'
                : 'Wipe all problem progress, notes, and streaks stored in this browser.'}
            </p>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => setDeleteAccountModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-hard px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-hard/90 active:scale-95 cursor-pointer shrink-0"
            >
              <Trash2 className="size-4" />
              <span>Delete Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-hard/40 bg-hard/10 px-4 py-2.5 text-xs font-semibold text-hard hover:bg-hard hover:text-white transition cursor-pointer shrink-0"
            >
              <RotateCcw className="size-4" />
              <span>Clear Local Data</span>
            </button>
          )}
        </div>
      </section>

      {/* Confirmation Modal: Reset Local Data */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-line bg-panel p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-hard">
              <AlertTriangle className="size-6" />
              <h3 className="font-serif text-xl font-bold text-ink">Reset All Local Data?</h3>
            </div>
            <p className="text-sm text-muted">
              This will permanently delete all solved problem marks, stopwatch times, and written notes stored in this browser.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleClearData()}
                className="rounded-xl bg-hard px-4 py-2 text-xs font-semibold text-white hover:bg-hard/90 cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Clearing…' : 'Yes, Reset Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Cloud Account */}
      {deleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-hard/40 bg-panel p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-hard">
              <Trash2 className="size-6" />
              <h3 className="font-serif text-xl font-bold text-ink">Delete Account Permanently</h3>
            </div>
            <p className="text-sm text-muted">
              You are about to permanently delete your TrainDSA account (<strong className="text-ink">{user?.email}</strong>) and all cloud records.
            </p>
            <div className="rounded-xl border border-hard/30 bg-hard/10 p-3 text-xs text-hard font-medium">
              ⚠️ This action cannot be reversed. All your problem notes, confidence ratings, and streak history will be wiped.
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted">
                Type <span className="font-bold text-ink">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-hard focus:ring-2 focus:ring-hard/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteAccountModalOpen(false)
                  setDeleteConfirmationText('')
                }}
                className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || deleteConfirmationText !== 'DELETE'}
                onClick={() => void handleDeleteAccount()}
                className="rounded-xl bg-hard px-4 py-2 text-xs font-semibold text-white hover:bg-hard/90 cursor-pointer disabled:opacity-50"
              >
                {busy ? 'Deleting Account…' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
