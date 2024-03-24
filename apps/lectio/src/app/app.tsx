import { lectionary } from '@lectio/lectionary'
import db from '../db'

export function App() {
  return <div className="text-blue-500">{lectionary()}</div>
}

export default App
