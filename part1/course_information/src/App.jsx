const Header = (course) => {
  return (
      <h1>{course.course}</h1>
  )
}

const Content = (parts) => {
  return (
    <div>
      <Part name = {parts.parts[0].name} number = {parts.parts[0].exercises}/>
      <Part name = {parts.parts[1].name} number = {parts.parts[1].exercises}/>
      <Part name = {parts.parts[2].name} number = {parts.parts[2].exercises}/>
    </div>
  )
}

const Part = (props) => {
  return (
  <>
    <p>
        {props.name} {props.number}
    </p>

  </>
  )
}

const Total = (parts) => {

  return (
    <div>
      <p>Number of exercises {parts.parts[0].exercises + parts.parts[1].exercises + parts.parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const header = course.name
  const parts = course.parts

  return (
    <div>
      <Header course={header} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App