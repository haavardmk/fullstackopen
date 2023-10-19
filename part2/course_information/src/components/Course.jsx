const Header = (course) => {
    return (
        <h1>{course.course}</h1>
    )
  }
  
  const Content = ({parts}) => {
  
    const p_parts = parts.map(part => <p>{part.name} {part.exercises}</p> )
  
    return (
      <div>
        <>{...p_parts}</>
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
  
  const Total = ({parts}) => {
  
    const total = parts.reduce((s, p) => {
      return s + p.exercises;
    }, 0);
    
    return (
      <div>
        <p>Number of exercises {total}</p>
      </div>
    )
  }
  
  const Course = ({course}) => {
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

  export default Course