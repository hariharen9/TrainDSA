import { useCallback, useState } from "react"
import type { SDStatus } from "../content/systemDesign"

const SD_STATUS_KEY = "traindsa_sd_status"
const SD_NOTES_KEY = "traindsa_sd_notes"

type SDStatusMap = Record<string, SDStatus>
type SDNotesMap = Record<string, string>

function loadSDStatus(): SDStatusMap {
  try {
    const raw = localStorage.getItem(SD_STATUS_KEY)
    return raw ? (JSON.parse(raw) as SDStatusMap) : {}
  } catch { return {} }
}

function saveSDStatus(data: SDStatusMap) {
  try { localStorage.setItem(SD_STATUS_KEY, JSON.stringify(data)) } catch {}
}

function loadSDNotes(): SDNotesMap {
  try {
    const raw = localStorage.getItem(SD_NOTES_KEY)
    return raw ? (JSON.parse(raw) as SDNotesMap) : {}
  } catch { return {} }
}

function saveSDNotes(data: SDNotesMap) {
  try { localStorage.setItem(SD_NOTES_KEY, JSON.stringify(data)) } catch {}
}

export function useSystemDesign() {
  const [statusMap, setStatusMap] = useState<SDStatusMap>(() => loadSDStatus())
  const [notesMap, setNotesMap] = useState<SDNotesMap>(() => loadSDNotes())

  const updateStatus = useCallback((topicId: string, status: SDStatus) => {
    setStatusMap((prev) => {
      const next = { ...prev, [topicId]: status }
      saveSDStatus(next)
      return next
    })
  }, [])

  const updateNote = useCallback((topicId: string, note: string) => {
    setNotesMap((prev) => {
      const next = { ...prev, [topicId]: note }
      saveSDNotes(next)
      return next
    })
  }, [])

  const getStatus = useCallback(
    (topicId: string): SDStatus => statusMap[topicId] ?? "not_started",
    [statusMap],
  )

  const getNote = useCallback(
    (topicId: string): string => notesMap[topicId] ?? "",
    [notesMap],
  )

  const reading = Object.values(statusMap).filter((s) => s === "reading").length
  const comfortable = Object.values(statusMap).filter((s) => s === "comfortable").length

  return { statusMap, notesMap, updateStatus, updateNote, getStatus, getNote, reading, comfortable }
}
