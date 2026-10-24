import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceDay, createMission, resolveEventChoice } from './mission.ts'
import { parseSavedMission } from './missionStorage.ts'

test('restores an active mission with its decisions and resources', () => {
  const mission = resolveEventChoice(
    { ...createMission(), day: 2 },
    'direct-course',
  )

  assert.deepEqual(parseSavedMission(JSON.stringify(mission)), mission)
})

test('restores a completed mission', () => {
  let mission = createMission()

  for (const [day, choice] of [
    [2, 'direct-course'],
    [4, 'storm-detour'],
    [6, 'precision-burn'],
  ]) {
    mission = { ...mission, day }
    mission = resolveEventChoice(mission, choice)
  }

  mission = { ...mission, day: 7 }
  mission = advanceDay(mission)

  assert.equal(mission.status, 'success')
  assert.deepEqual(parseSavedMission(JSON.stringify(mission)), mission)
})

test('restores a failed mission', () => {
  const mission = advanceDay({ ...createMission(), day: 7 })

  assert.equal(mission.status, 'failure')
  assert.deepEqual(parseSavedMission(JSON.stringify(mission)), mission)
})

test('rejects malformed or invalid saved missions', () => {
  const mission = createMission()
  const invalidDay = { ...mission, day: 0 }
  const invalidResource = {
    ...mission,
    resources: { ...mission.resources, energia: 101 },
  }

  assert.equal(parseSavedMission(null), null)
  assert.equal(parseSavedMission('{not json'), null)
  assert.equal(parseSavedMission(JSON.stringify({ day: 1 })), null)
  assert.equal(parseSavedMission(JSON.stringify(invalidDay)), null)
  assert.equal(parseSavedMission(JSON.stringify(invalidResource)), null)
})
