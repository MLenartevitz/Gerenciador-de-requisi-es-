// Seleção dos elementos pela classe
const grid = document.querySelector('.grid');
const modal = document.querySelector('#modal');
const modalOverlay = document.querySelector('.modal-overlay');
const sidebarButtons = document.querySelectorAll('.sidebar button');

// Função para abrir o modal
function abrirModal() {
  console.log('Abrindo o modal...');
  modal.style.display = 'block';
  modalOverlay.style.display = 'block';
  desativarBotoes();
}

// Função para fechar o modal
function fecharModal() {
  console.log('Fechando o modal...');
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';
  ativarBotoes();
}

// Função para desativar os botões
function desativarBotoes() {
  sidebarButtons.forEach(button => {
    button.disabled = true;
  });
}

// Função para ativar os botões
function ativarBotoes() {
  sidebarButtons.forEach(button => {
    button.disabled = false;
  });
}

// Função para adicionar item manualmente e enviar ao backend
async function adicionarItem() {
  const descricao = document.querySelector('#Descrição').value.trim();
  const quantidade = document.querySelector('#Quantidade').value.trim();
  const observacao = document.querySelector('#Observação').value.trim();

  if (!descricao || !quantidade || !observacao) {
    return alert('Preencha todas as informações do item.');
  }

  if (isNaN(quantidade) || quantidade <= 0) {
    return alert('A quantidade precisa ser um número válido e maior que 0.');
  }

  const numRequisicao = await buscarNumeroRequisicao();
  if (!numRequisicao) {
    return alert('Nenhuma requisição disponível. Crie uma antes de adicionar itens.');
  }

  const requisicao = {
    descricao,
    qtde: parseInt(quantidade),
    observacao,
    num_requisicao: numRequisicao,
  };

  console.log('Enviando item:', requisicao);

  try {
    const response = await fetch('http://localhost:5500/api/requisicoesgrid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(requisicao),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar item');
    }

    console.log('Item adicionado com sucesso!');

    // Recarrega a página automaticamente após adicionar o item
    window.location.reload();
  } catch (error) {
    console.error('Erro ao adicionar o item:', error);
    alert('Erro ao adicionar item.');
  }
}

// Função para remover o primeiro item
async function removerItem() {
  try {
    const response = await fetch(`http://localhost:5500/api/requisicoesgrid/remover-primeiro`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Erro ao remover item.');
    }

    if (responseData.error === 'Nenhum item encontrado para excluir.') {
      alert('Não há itens no banco de dados para remover.');
      return;
    }

    console.log('Primeiro item removido com sucesso.');

    // Recarrega a página automaticamente após remover o item
    window.location.reload();
  } catch (error) {
    console.error('Erro ao remover o item:', error);
    alert('Erro ao remover o item do banco de dados.');
  }
}

// Função para buscar o `num_requisicao` da última requisição no banco
async function buscarNumeroRequisicao() {
  try {
    const response = await fetch('http://localhost:5500/api/requisicoes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar requisições');
    }

    const requisicoes = await response.json();
    console.log('Requisições obtidas:', requisicoes);

    // Retorna o `num_requisicao` da última requisição cadastrada
    return requisicoes.length > 0 ? requisicoes[requisicoes.length - 1].num_requisicao : null;
  } catch (error) {
    console.error('Erro ao buscar requisições:', error);
    return null;
  }
}

// Função para buscar e exibir os itens já cadastrados no backend
async function buscarItens() {
  try {
    const response = await fetch('http://localhost:5500/api/requisicoesgrid', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar requisições.');
    }

    const data = await response.json();
    console.log('Itens carregados:', data);

    // Limpa o grid antes de adicionar os itens
    grid.innerHTML = '';

    if (!data.grid || data.grid.length === 0) {
      grid.innerHTML = '<p>Nenhuma requisição encontrada.</p>';
      return;
    }

    // Adiciona os itens ao grid
    data.grid.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <strong>Requisição:</strong> ${item.num_requisicao || 'N/A'} <br>
        <strong>Descrição:</strong> ${item.descricao || 'N/A'}  <br>
        <strong>Quantidade:</strong> ${item.qtde || 'N/A'} <br>
        <strong>Observação:</strong> ${item.observacao || 'N/A'} <br>
      `;
      itemDiv.style.border = '1px solid black';
      itemDiv.style.padding = '10px';
      itemDiv.style.textAlign = 'center';
      itemDiv.style.background = '#f9f9f9';
      itemDiv.style.borderRadius = '8px';
      grid.appendChild(itemDiv);
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    alert('Erro ao buscar itens.');
  }
}

// Chamar a função automaticamente quando a página carregar
window.addEventListener('load', buscarItens);
