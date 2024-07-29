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
        const response = await fetch('http://homologacao3.azapfy.com.br/api/ps/metahumans');
        if (!response.ok) throw new Error('Resposta da api não funcionou');
        const data = await response.json();
        setHeroes(data);
        setFilteredHeroes(data);
        console.log(data);

        // Dados falsos para teste
        // const dadosFalsos = [
        //   { id: 1, name: 'Superman', image: 'https://via.placeholder.com/150', powerstats: { combat: 100, durability: 90, intelligence: 80, power: 70, speed: 60, strength: 110 } },
        //   { id: 2, name: 'Batman', image: 'https://via.placeholder.com/150', powerstats: { combat: 80, durability: 70, intelligence: 90, power: 60, speed: 50, strength: 70 } },
        //   // Adicione mais dados de teste aqui
        // ];

        // console.log('Dados recebidos:', dadosFalsos); // Log dos dados falsos
        // setHeroes(dadosFalsos); // Armazenar os dados no estado
        // setFilteredHeroes(dadosFalsos); // Inicialmente, mostrar todos os heróis

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

  // Função para calcular a soma dos atributos de powerstats
const calcularSomaPowerstats = (powerstats) => {
  let total = 0;

  // Itera sobre cada atributo em powerstats e soma os valores
  Object.keys(powerstats).forEach(key => {
    total += powerstats[key];
  });

  return total;
};

  // Função para calcular o herói vencedor
  const calcularVencedor = (heroesToCompare) => {
    if (heroesToCompare.length < 2) return;
    
    const vencedor = heroesToCompare.reduce((max, hero) => {
      const somaAtual = calcularSomaPowerstats(hero.powerstats);
      const somaMax = calcularSomaPowerstats(max.powerstats);
      return somaAtual > somaMax ? hero : max;
    }, heroesToCompare[0]);

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
                onClick={() => selecionarHeroi(hero)}
              >
                <img src={hero.images.sm} className="card-img-top img-fluid" alt={hero.name} />
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
              <div className='container-fluid'>
                <div className="row">
                  {/* Mostrar metade do modal para a imagem e a outra metade para os atributos */}
                  <div className="col-6">
                    <img src={winner.images.sm} className="img-fluid" alt={winner.name} />  
                  </div>
                  <div className="col-6">
                    <h5 className="nome-vencedor">{winner.name}</h5>
                    <h5>Combate: {winner.powerstats.combat}</h5>
                    <h5>Durabilidade: {winner.powerstats.durability}</h5>
                    <h5>Inteligência: {winner.powerstats.intelligence}</h5>
                    <h5>Poder: {winner.powerstats.power}</h5>
                    <h5>Velocidade: {winner.powerstats.speed}</h5>
                    <h5>Força: {winner.powerstats.strength}</h5>
                  </div>
                </div>
              </div>
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
