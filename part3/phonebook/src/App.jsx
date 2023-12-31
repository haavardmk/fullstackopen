import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Server from "./backend/backend";
import "./index.css";

const Phonebook = ({ persons, onDelete }) => {
  const mapped_person = persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}{" "}
      <button onClick={() => onDelete(person.id)}>Delete</button>
    </p>
  ));

  return mapped_person;
};

Phonebook.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const SearchForm = ({ handleFilterChange, newFilter }) => {
  return (
    <form onChange={handleFilterChange}>
      <div>
        name: <input value={newFilter} onChange={handleFilterChange} />
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  handleFilterChange: PropTypes.func.isRequired,
  newFilter: PropTypes.string.isRequired,
};

const NameAndNumberForm = ({
  handleNameChange,
  handleNumberChange,
  addNameAndNumber,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={addNameAndNumber}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

NameAndNumberForm.propTypes = {
  handleNameChange: PropTypes.func.isRequired,
  handleNumberChange: PropTypes.func.isRequired,
  addNameAndNumber: PropTypes.func.isRequired,
  newName: PropTypes.string.isRequired,
  newNumber: PropTypes.string.isRequired,
};

const Notification = ({ message, error }) => {
  if (message && error === null) {
    return null;
  }

  if (message !== null) {
    return <div className="message">{message}</div>;
  }

  if (error !== null) {
    return <div className="error">{error}</div>;
  }
};

Notification.defaultProps = {
  message: '',
  error: '',
};


Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.string
};

const App = () => {
  const [persons, setPersons] = useState([
    // { name: "Arto Hellas", number: "040-123456", id: 1 },
    // { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    // { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    // { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [updateApp, setUpdateApp] = useState(0);

  useEffect(() => {
    console.log("effect");
    Server.getAll().then((data) => {
      setPersons(data);
    });
  }, [updateApp]);

  const deletePerson = (id) => {
    let name = persons.find((person) => person.id === id);
    if (confirm("Are you sure you want to delete " + name.name + "?")) {
      console.log("Removing", id, name.name);

      Server.remove(id)
        .then((result) => {
          if (result === 0) {
            console.log("Deletion successful");
            setUpdateApp(updateApp + 1);
          } else {
            setError(
              "Information of " +
                name.name +
                " has already been removed from server"
            );
            setTimeout(() => {
              setError(null);
            }, 5000);
            console.error("Deletion failed");
          }
        })
        .catch((error) => {
          setError(
            "Information of " +
              name.name +
              " has already been removed from server"
          );
          setTimeout(() => {
            setError(null);
          }, 5000);
          console.error("Deletion error", error);
        });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const addNameAndNumber = (event) => {
    event.preventDefault();

    Server.getAll()
      .then((personsOnServer) => {
        console.log("Server:", personsOnServer);

        if (persons.some((person) => person.name === newName)) {
          if (
            confirm(
              `${newName} is already added to phonebook, replace the old number with new one?`
            )
          ) {
            if (!personsOnServer.some((person) => person.name === newName)) {
              setError(
                "Information of " +
                  newName +
                  "has already been removed from server"
              );
              setTimeout(() => {
                setError(null);
              }, 5000);
            }

            let updatePerson = persons.find(
              (person) => person.name === newName
            );
            updatePerson.number = newNumber;
            Server.update(updatePerson.id, {
              name: updatePerson.name,
              number: updatePerson.number,
              id: updatePerson.id,
            });
            //const updatePersons = persons.map((person) => person.id === updatePerson.id ? updatePerson : person)
            setMessage("Changed " + newName + "s number");
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setUpdateApp(updateApp + 1);
          }
        } else {
          addToServer({
            name: newName,
            number: newNumber,
            id: persons.length + 1,
          });
        }
        setNewName("");
        setNewNumber("");
        setUpdateApp(updateApp + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addToServer = (newPerson) => {
    Server.create(newPerson)
      .then(() => {
        setUpdateApp(updateApp + 1);
        setMessage("Added " + newName + " to phonebook");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response.data.error.includes("shorter")) {
          setError(
            "Name: " +
              newPerson.name +
              " is too short, should be at least 3 characters long"
          );
          setTimeout(() => {
            setError(null);
          }, 5000);
        } else if (error.response.data.error.includes("number")) {
          setError("Number: " + newPerson.number + " not correctly formatted");
          setTimeout(() => {
            setError(null);
          }, 5000);
        } else {
          setError("Unknown error: " + error.response.data.error);
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
        console.log(error.response.data.error);
      });
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const searchFilter = (persons) =>
    persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    );

  //console.log(persons);
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <SearchForm
        handleFilterChange={handleFilterChange}
        newFilter={newFilter}
      />
      <h3>Add new: </h3>
      <NameAndNumberForm
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNameAndNumber={addNameAndNumber}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Phonebook persons={searchFilter(persons)} onDelete={deletePerson} />
    </div>
  );
};



export default App;
