import { useEffect } from 'react'
import type { TrialRecorder } from '../telemetry/tracker'
import type { MatrixParams, MstParams, NBackParams, RelationalParams, RotationParams, StroopParams, TaskPayload, TowerParams, UfovParams } from '../telemetry/types'
import { Matrix } from './Matrix'
import { MentalRotation } from './MentalRotation'
import { Mst } from './Mst'
import { NBack } from './NBack'
import { Relational } from './Relational'
import { Stroop } from './Stroop'
import { Tower } from './Tower'
import { Ufov } from './Ufov'
import type { VoiceSource } from '../voice/voiceProbe'

// Every task component takes these props and calls tracker.push(recorder.finish(...)) once per trial.
export type TaskProps<P> = { params: P; recorder: TrialRecorder; onDone: () => void }

// `voice` is the opt-in probe; only Stroop (spoken color naming) uses it.
type Props = { task: TaskPayload; recorder: TrialRecorder; onDone: () => void; voice?: VoiceSource | null }

export function TaskRunner(props: Props) {
  const { task, onDone } = props
  switch (task.schema_type) {
    // Tasks 5–11 add one case each.
    case 'n_back':
      return <NBack params={task.params as NBackParams} recorder={props.recorder} onDone={onDone} />
    case 'stroop':
      return <Stroop params={task.params as StroopParams} recorder={props.recorder} onDone={onDone} voice={props.voice} />
    case 'matrix':
      return <Matrix params={task.params as MatrixParams} recorder={props.recorder} onDone={onDone} />
    case 'mental_rotation':
      return <MentalRotation params={task.params as RotationParams} recorder={props.recorder} onDone={onDone} />
    case 'relational':
      return <Relational params={task.params as RelationalParams} recorder={props.recorder} onDone={onDone} />
    case 'tower':
      return <Tower params={task.params as TowerParams} recorder={props.recorder} onDone={onDone} />
    case 'ufov':
      return <Ufov params={task.params as UfovParams} recorder={props.recorder} onDone={onDone} />
    case 'mst':
      return <Mst params={task.params as MstParams} recorder={props.recorder} onDone={onDone} />
    default:
      return <Unsupported schemaType={task.schema_type} onDone={onDone} />
  }
}

// ponytail: the pause stops an unknown task from hot-looping fetch → skip → fetch against the API.
const SKIP_MS = 1500

function Unsupported({ schemaType, onDone }: { schemaType: string; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, SKIP_MS)
    return () => clearTimeout(id)
  }, [onDone])
  return <p role="status">Unsupported task ({schemaType}). Moving on…</p>
}
