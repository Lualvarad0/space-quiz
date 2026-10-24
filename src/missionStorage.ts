import { MISSION_DAYS, MISSION_EVENTS, type MissionState } from './mission.ts'

export const MISSION_STORAGE_KEY = 'orbita.activeMission.v1'

const resourceNames = ['combustible', 'energia', 'suministros', 'casco'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMissionState(value: unknown): value is MissionState {
  if (!isRecord(value) || !isRecord(value.resources)) {
    return false
  }

  const { day, progress, resolvedEvents, status, log, resources } = value
  const validStatuses = ['active', 'success', 'failure']
  const validEventDays = MISSION_EVENTS.map((event) => event.day)
  const resourcesAvailable = resourceNames.every((resource) => Number(resources[resource]) > 0)
  const resourcesDepleted = resourceNames.some((resource) => Number(resources[resource]) === 0)

  return (
    Number.isInteger(day) &&
    Number(day) >= 1 &&
    Number(day) <= MISSION_DAYS &&
    Number.isInteger(progress) &&
    Number(progress) >= 0 &&
    Number(progress) <= MISSION_EVENTS.length &&
    validStatuses.includes(String(status)) &&
    Array.isArray(resolvedEvents) &&
    resolvedEvents.every(
      (eventDay) =>
        Number.isInteger(eventDay) &&
        Number(eventDay) <= Number(day) &&
        validEventDays.includes(Number(eventDay)),
    ) &&
    new Set(resolvedEvents).size === resolvedEvents.length &&
    Number(progress) === resolvedEvents.length &&
    Array.isArray(log) &&
    log.length > 0 &&
    log.length <= 5 &&
    log.every((entry) => typeof entry === 'string') &&
    resourceNames.every(
      (resource) =>
        Number.isInteger(resources[resource]) &&
        Number(resources[resource]) >= 0 &&
        Number(resources[resource]) <= 100,
    ) &&
    (status !== 'active' || resourcesAvailable) &&
    (status !== 'success' ||
      (day === MISSION_DAYS && progress === MISSION_EVENTS.length && resourcesAvailable)) &&
    (status !== 'failure' || day === MISSION_DAYS || resourcesDepleted)
  )
}

export function parseSavedMission(saved: string | null): MissionState | null {
  if (saved === null) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(saved)
    return isMissionState(parsed) ? parsed : null
  } catch {
    return null
  }
}
