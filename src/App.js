import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import './App.css';

function App() {
  // Estado para armazenar os heróis
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal
  const [winner, setWinner] = useState(null); // Estado para armazenar o herói vencedor

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchHeroes = async () => {
      try {
        // API não estava retornando corretamente durante a minha prova então utilizei dados falsos
        // const response = await fetch('http://homologacao3.azapfy.com.br/api/ps/metahumans');
        // if (!response.ok) throw new Error('Resposta da api não funcionou');
        // const data = await response.json();
        // console.log(data);

        // Dados falsos para teste
        // Não consegui visualizar na Api como seria o powerstatus então eu imagino que seja dessa forma:
        const dadosFalsos = [
          { id: 1, name: 'Superman', image: 'https://via.placeholder.com/150', powerstatus: 100 },
          { id: 2, name: 'Batman', image: 'https://via.placeholder.com/150', powerstatus: 80 },
          { id: 3, name: 'Batgirl', image: 'https://via.placeholder.com/150', powerstatus: 90 },
          { id: 4, name: 'Wonder Woman', image: 'https://via.placeholder.com/150', powerstatus: 90 }
        ];
        
        console.log('Dados recebidos:', dadosFalsos); // Log dos dados falsos
        setHeroes(dadosFalsos); // Armazenar os dados no estado
        setFilteredHeroes(dadosFalsos); // Inicialmente, mostrar todos os heróis

      } catch (error) {
        console.error('Error fetching the heroes:', error);
      }
    };

    // Chamar a função de fetch quando o componente for montado
    fetchHeroes();
  }, []);

  // Função para lidar com mudanças no campo de busca
  const campoDeBusca = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    // Filtrar os heróis com base no termo de busca
    const filtered = heroes.filter(hero =>
      hero.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredHeroes(filtered);
  };

  // Função para calcular o herói vencedor
  const calcularVencedor = () => {
    if (filteredHeroes.length === 0) return;
    const vencedor = filteredHeroes.reduce((max, hero) => (hero.powerstatus > max.powerstatus ? hero : max), filteredHeroes[0]);
    setWinner(vencedor);
    setShowModal(true);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <form className="d-flex mx-auto mt-3 mb-3" role="search">
            <input
              className="form-control"
              type="search"
              placeholder="Busque o herói"
              value={searchTerm}
              onChange={campoDeBusca}
            />
            <button
              className="btn btn-custom ms-3"
              type="button"
              onClick={calcularVencedor}
            >
              Iniciar combate
            </button>
          </form>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row">
          {/* Renderizar os cards dinamicamente */}
          {filteredHeroes.map(hero => (
            <div className="col-12 col-md-4 col-lg-3 mx-auto mt-5" key={hero.id}>
              <div className="card card-animacao mx-auto" style={{ width: '18rem' }}>
                <img src={hero.image} className="card-img-top" alt={hero.name} />
                <div className="card-body">
                  <h5 className="card-title">{hero.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para exibir o herói vencedor do bootstrap */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Herói Vencedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {winner ? (
            <div className="text-center">
              <img src={winner.image} className="img-fluid mb-3" alt={winner.name} />
              <h5>{winner.name}</h5>
              <p>Atributo de Poder: {winner.powerstatus}</p>
            </div>
          ) : (
            <p>Nenhum herói selecionado.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
