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
  const [selectedHeroes, setSelectedHeroes] = useState([]); // Estado para armazenar os heróis selecionados

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchHeroes = async () => {
      try {
        // API não estava retornando corretamente durante toda a minha prova então utilizei dados falsos. Funcionou apenas uma vez e depois nem quando eu tentava acessar a URL. Não alterei o código para recuperar os dados então acredito que o erro tenha sido da própria Api
        // const response = await fetch('http://homologacao3.azapfy.com.br/api/ps/metahumans');
        // if (!response.ok) throw new Error('Resposta da api não funcionou');
        // const data = await response.json();
        // console.log(data);

        // Dados falsos para teste
        // Não consegui visualizar na Api como seria o powerstatus então eu imagino que seja dessa forma:
        const dadosFalsos = [
          { id: 1, name: 'Superman', image: 'https://via.placeholder.com/150', powerstatus: 100 },
          { id: 2, name: 'Batman', image: 'https://via.placeholder.com/150', powerstatus: 60 },
          { id: 3, name: 'Batgirl', image: 'https://via.placeholder.com/150', powerstatus: 65 },
          { id: 4, name: 'Wonder Woman', image: 'https://via.placeholder.com/150', powerstatus: 90 },
          { id: 5, name: 'Batman2', image: 'https://via.placeholder.com/150', powerstatus: 120 },
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

  // Função para selecionar heróis
  const selecionarHeroi = (hero) => {
    const alreadySelected = selectedHeroes.find(h => h.id === hero.id);

    if (alreadySelected) {
      setSelectedHeroes(selectedHeroes.filter(h => h.id !== hero.id));
    } else if (selectedHeroes.length < 2) {
      setSelectedHeroes([...selectedHeroes, hero]);
      // Se há exatamente 2 heróis selecionados, calcular o vencedor automaticamente
      if (selectedHeroes.length === 1) {
        calcularVencedor([hero, ...selectedHeroes]);
      }
    }
  };

  // Função para calcular o herói vencedor
  const calcularVencedor = (heroesToCompare) => {
    if (heroesToCompare.length < 2) return;
    
    const vencedor = heroesToCompare.reduce((max, hero) => (hero.powerstatus > max.powerstatus ? hero : max), heroesToCompare[0]);
    setWinner(vencedor);
    setShowModal(true);
  };

  // Função para lidar com o clique do campo de filtrados para mais de 2 super herois
  const iniciarCombate = () => {
    if (selectedHeroes.length === 0) {
      calcularVencedor(filteredHeroes);
    }
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
              onClick={iniciarCombate}
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
              <div
                className={`card card-animacao mx-auto ${selectedHeroes.find(h => h.id === hero.id) ? 'borda-clicada' : ''}`}
                style={{ width: '18rem' }}
                onClick={() => selecionarHeroi(hero)} // Adiciona um clique ao card
              >
                <img src={hero.image} className="card-img-top" alt={hero.name} />
                <div className="card-body">
                  <h5 className="card-title">{hero.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para exibir o herói vencedor */}
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
