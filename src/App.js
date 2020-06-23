import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])
  const [repository, setRepository] = useState({ title: '', owner: '', techs: [] })

  async function handleAddRepository() {
    const { title, owner, techs } = repository
    const model = { title: '', owner: '', techs: [] }

    await api.post('/repositories', { title, owner, techs })
    .then(response => {
      setRepository(model)
      setRepositories([ ...repositories, response.data ])
    })
  }

  async function handleRemoveRepository(id) {
    const repositoryIndex = repositories.findIndex(response => response.id === id)
    
    if(repositoryIndex !== -1)
    {
      const newRepositories = repositories.filter(response => response.id !== id)
      setRepositories(newRepositories)

      await api.delete(`/repositories/${id}`)
      .then(() => {})
      .catch(error => console.log(error))
    }
  }

  async function handleRepositories() {
    await api.get('/repositories')
    .then(response => {
      setRepositories(response.data)
    })
  }

  useEffect(() => {
    handleRepositories()
  }, [])

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(response => {
            return (
              <li key={response.id}>
                {response.title}
      
                <button onClick={() => handleRemoveRepository(response.id)}>
                  Remover
                </button>
              </li>
            )
          })
        }
      </ul>

      <input
        placeholder="Título"
        value={repository.title}
        onChange={response => setRepository({ ...repository, title: response.target.value })}
      />
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
