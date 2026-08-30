import { useCallback, useState } from "react"
import type { BehavioralStatus } from "../content/behavioral"

const BEHAVIORAL_STATUS_KEY = "traindsa_behavioral_status"
const BEHAVIORAL_NOTES_KEY = "traindsa_behavioral_notes"

type BehavioralStatusMap = Record<string, BehavioralStatus>
type BehavioralNotesMap = Record<string, string>

function loadBehavioralStatus(): BehavioralStatusMap {
  try {
    const raw = localStorage.getItem(BEHAVIORAL_STATUS_KEY)
    return raw ? (JSON.parse(raw) as BehavioralStatusMap) : {}
  } catch { return {} }
}

function saveBehavioralStatus(data: BehavioralStatusMap) {
  try { localStorage.setItem(BEHAVIORAL_STATUS_KEY, JSON.stringify(data)) } catch {}
}

function loadBehavioralNotes(): BehavioralNotesMap {
  try {
    const raw = localStorage.getItem(BEHAVIORAL_NOTES_KEY)
    return raw ? (JSON.parse(raw) as BehavioralNotesMap) : {}
  } catch { return {} }
}

function saveBehavioralNotes(data: BehavioralNotesMap) {
  try { localStorage.setItem(BEHAVIORAL_NOTES_KEY, JSON.stringify(data)) } catch {}
}

export function useBehavioral() {
  const [statusMap, setStatusMap] = useState<BehavioralStatusMap>(() => loadBehavioralStatus())
  const [notesMap, setNotesMap] = useState<BehavioralNotesMap>(() => loadBehavioralNotes())

  const updateStatus = useCallback((questionId: string, status: BehavioralStatus) => {
    setStatusMap((prev) => {
      const next = { ...prev, [questionId]: status }
      saveBehavioralStatus(next)
      return next
    })
  }, [])

  const updateNote = useCallback((questionId: string, note: string) => {
    setNotesMap((prev) => {
      const next = { ...prev, [questionId]: note }
      saveBehavioralNotes(next)
      return next
    })
  }, [])

  const getStatus = useCallback(
    (questionId: string): BehavioralStatus => statusMap[questionId] ?? "not_prepared",
    [statusMap],
  )

  const getNote = useCallback(
    (questionId: string): string => notesMap[questionId] ?? "",
    [notesMap],
  )

  const drafted = Object.values(statusMap).filter((s) => s === "drafted").length
  const ready = Object.values(statusMap).filter((s) => s === "ready").length

  return { statusMap, notesMap, updateStatus, updateNote, getStatus, getNote, drafted, ready }
}
