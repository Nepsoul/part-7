import { useState, useEffect } from "react";
import noteService from "./service/noteApi";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return { type, value, onChange };
};

const useResource = (baseUrl) => {
  const [resource, setResource] = useState([]);

  useEffect(() => {
    noteService.getAll(baseUrl).then((data) => {
      setResource(data);
    });
  }, [baseUrl]);

  const create = (resources) => {
    //console.log(resource, "resource");
    //console.log(resources, "resources");
    //console.log(baseUrl, "baseUrl");
    noteService.create(resources, baseUrl).then((response) => {
      setResource(resource.concat(response));
      //setResource([...resource,response]);
    });
  };

  const service = {
    create,
  };

  return [resource, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  //console.log(noteService, "noteService");
  const [persons, personService] = useResource("http://localhost:3005/persons");
  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input
          type={content.type}
          value={content.value}
          onChange={content.onChange}
        />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} />
        <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name}
          {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
