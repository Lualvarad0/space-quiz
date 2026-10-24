export type ResourceName = 'combustible' | 'energia' | 'suministros' | 'casco'
export type MissionStatus = 'active' | 'success' | 'failure'

export type ResourceLevels = Record<ResourceName, number>

export interface MissionState {
  day: number
  resources: ResourceLevels
  progress: number
  resolvedEvents: number[]
  status: MissionStatus
  log: string[]
}

export interface EventChoice {
  id: string
  title: string
  description: string
  effects: Partial<ResourceLevels>
  progress: number
}

export interface EventChoiceImpact {
  resources: Partial<ResourceLevels>
  progress: number
}

export interface MissionEvent {
  day: number
  title: string
  description: string
  choices: EventChoice[]
}

export const MISSION_DAYS = 7

export const MISSION_EVENTS: MissionEvent[] = [
  {
    day: 2,
    title: 'Una ruta bajo presión',
    description:
      'Una pequeña desviación altera el rumbo de la nave. El equipo detecta dos formas de corregirlo.',
    choices: [
      {
        id: 'direct-course',
        title: 'Corregir rumbo',
        description: 'Consume combustible para retomar la trayectoria más corta.',
        effects: { combustible: -10 },
        progress: 1,
      },
      {
        id: 'sensor-calibration',
        title: 'Recalibrar sensores',
        description: 'Usa energía adicional para navegar con mayor precisión.',
        effects: { energia: -12 },
        progress: 1,
      },
    ],
  },
  {
    day: 4,
    title: 'Tormenta de partículas',
    description:
      'El sistema de navegación advierte una zona inestable. Puedes rodearla o reforzar el casco.',
    choices: [
      {
        id: 'storm-detour',
        title: 'Rodear la tormenta',
        description: 'Una ruta más larga que exige combustible, pero evita daños.',
        effects: { combustible: -8, casco: 5 },
        progress: 1,
      },
      {
        id: 'reinforce-hull',
        title: 'Reforzar el casco',
        description: 'Protege la nave con energía y materiales de los suministros.',
        effects: { energia: -14, suministros: -5, casco: 18 },
        progress: 1,
      },
    ],
  },
  {
    day: 6,
    title: 'Aproximación final',
    description:
      'El objetivo está a la vista. Una última maniobra decidirá cómo llega la nave.',
    choices: [
      {
        id: 'precision-burn',
        title: 'Maniobra de precisión',
        description: 'Gasta combustible para completar el acercamiento con control.',
        effects: { combustible: -12 },
        progress: 1,
      },
      {
        id: 'power-down',
        title: 'Apagar módulos secundarios',
        description: 'Ahorra energía y suministros durante el tramo final.',
        effects: { energia: -9, suministros: -5 },
        progress: 1,
      },
    ],
  },
]

export function createMission(): MissionState {
  return {
    day: 1,
    resources: {
      combustible: 78,
      energia: 82,
      suministros: 80,
      casco: 92,
    },
    progress: 0,
    resolvedEvents: [],
    status: 'active',
    log: ['Misión iniciada. La nave está lista para abandonar la órbita terrestre.'],
  }
}

export function getEventForDay(day: number): MissionEvent | undefined {
  return MISSION_EVENTS.find((event) => event.day === day)
}

function applyResourceEffects(
  resources: ResourceLevels,
  effects: Partial<ResourceLevels>,
): ResourceLevels {
  const updatedResources = { ...resources }
  for (const [resource, amount] of Object.entries(effects) as [ResourceName, number][]) {
    updatedResources[resource] = Math.max(0, Math.min(100, resources[resource] + amount))
  }
  return updatedResources
}

export function getEventChoiceImpact(
  state: MissionState,
  choice: EventChoice,
): EventChoiceImpact {
  const updatedResources = applyResourceEffects(state.resources, choice.effects)
  const resources: Partial<ResourceLevels> = {}

  for (const resource of Object.keys(choice.effects) as ResourceName[]) {
    resources[resource] = updatedResources[resource] - state.resources[resource]
  }

  return { resources, progress: choice.progress }
}

export function resolveEventChoice(state: MissionState, choiceId: string): MissionState {
  const event = getEventForDay(state.day)
  const choice = event?.choices.find((item) => item.id === choiceId)

  if (state.status !== 'active' || !event || !choice || state.resolvedEvents.includes(state.day)) {
    throw new Error('La decisión ya no está disponible para esta jornada.')
  }

  const resources = applyResourceEffects(state.resources, choice.effects)

  return {
    ...state,
    resources,
    progress: state.progress + choice.progress,
    resolvedEvents: [...state.resolvedEvents, state.day],
    log: [`Día ${state.day}: ${choice.title}. ${choice.description}`, ...state.log].slice(0, 5),
  }
}

export function advanceDay(state: MissionState): MissionState {
  if (state.status !== 'active') {
    throw new Error('La misión ya ha terminado.')
  }
  if (getEventForDay(state.day) && !state.resolvedEvents.includes(state.day)) {
    throw new Error('Resuelve el evento actual antes de avanzar.')
  }

  const resources: ResourceLevels = {
    combustible: Math.max(0, state.resources.combustible - 5),
    energia: Math.max(0, state.resources.energia - 5),
    suministros: Math.max(0, state.resources.suministros - 6),
    casco: state.resources.casco,
  }
  const depleted = Object.values(resources).some((value) => value <= 0)

  if (depleted) {
    return {
      ...state,
      resources,
      status: 'failure',
      log: ['La misión se ha detenido: un recurso crítico llegó a cero.', ...state.log].slice(0, 5),
    }
  }

  if (state.day === MISSION_DAYS) {
    const success = state.progress >= 3
    return {
      ...state,
      resources,
      status: success ? 'success' : 'failure',
      log: [
        success
          ? 'Objetivo alcanzado. La misión concluyó con éxito.'
          : 'La nave llegó al objetivo, pero no completó los preparativos necesarios.',
        ...state.log,
      ].slice(0, 5),
    }
  }

  const nextDay = state.day + 1
  return {
    ...state,
    day: nextDay,
    resources,
    log: [`Día ${nextDay}: comienza una nueva jornada de misión.`, ...state.log].slice(0, 5),
  }
}
