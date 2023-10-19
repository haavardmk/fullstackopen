import { useState } from 'react'


const StatisticLine = props => <tr><td>{props.text}</td><td>{props.value}</td></tr>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = () => {return (good - bad)}
  const positve = () => {return (good / (good + neutral + bad)*100)}

  if (all < 1) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  else{
  return (
    <table>
      <tbody>
        <StatisticLine text={'Good '} value={good} />
        <StatisticLine text={'Neutral '} value={neutral} />
        <StatisticLine text={'Bad '} value={bad} />
        <StatisticLine text={'All '} value={all} />
        <StatisticLine text={'Average '} value={average()} />
        <StatisticLine text={'Positive '} value={positve() + '%'} />
      </tbody>
    </table>
  )
}
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App