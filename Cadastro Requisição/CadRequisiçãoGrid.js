const grid = document.querySelector('.grid');
const modal = document.querySelector('#modal');
const modalOverlay = document.querySelector('.modal-overlay');
const sidebarButtons = document.querySelectorAll('.sidebar button');

let itemSelecionado = null;

function abrirModal() {
  modal.style.display = 'block';
  modalOverlay.style.display = 'block';
  desativarBotoes();
}

function fecharModal() {
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';
  ativarBotoes();
  limparCamposModal();
}

function desativarBotoes() {
  sidebarButtons.forEach(button => button.disabled = true);
}

function ativarBotoes() {
  sidebarButtons.forEach(button => button.disabled = false);
}

function limparCamposModal() {
  document.querySelector('#Descrição').value = '';
  document.querySelector('#Quantidade').value = '';
  document.querySelector('#Observação').value = '';
  document.querySelector('#unidadeMedida').value = '';
  document.querySelector('#numRequisicao').value = '';
}

async function carregarRequisicoes() {
  try {
    const response = await fetch('http://localhost:5500/api/requisicoes');
    const requisicoes = await response.json();
    const selectRequisicao = document.querySelector('#numRequisicao');
    selectRequisicao.innerHTML = '<option value="" disabled selected>Selecione uma requisição</option>';
    requisicoes.forEach(requisicao => {
      const option = document.createElement('option');
      option.value = requisicao.num_requisicao;
      option.textContent = `Requisição ${requisicao.num_requisicao}`;
      selectRequisicao.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar requisições:', error);
  }
}

async function buscarItens() {
  try {
    const response = await fetch('http://localhost:5500/api/requisicoesgrid', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    const data = await response.json();
    grid.innerHTML = '';

    if (!data.grid || data.grid.length === 0) {
      grid.innerHTML = '<p>Nenhuma requisição encontrada.</p>';
      return;
    }

    // Cabeçalho estilo Excel
    const header = document.createElement('div');
    header.classList.add('grid-row', 'header');
    header.innerHTML = `
      <div class="grid-cell"><strong>Requisição</strong></div>
      <div class="grid-cell"><strong>Descrição</strong></div>
      <div class="grid-cell"><strong>Quantidade</strong></div>
      <div class="grid-cell"><strong>Observação</strong></div>
      <div class="grid-cell"><strong>Unidade</strong></div>
    `;
    grid.appendChild(header);

    data.grid.forEach(item => {
      const row = document.createElement('div');
      row.classList.add('grid-row');
      row.dataset.id = item.num_item_req;

      row.innerHTML = `
        <div class="grid-cell">${item.num_requisicao || 'N/A'}</div>
        <div class="grid-cell">${item.descricao || 'N/A'}</div>
        <div class="grid-cell">${item.qtde || 'N/A'}</div>
        <div class="grid-cell">${item.observacao || 'N/A'}</div>
        <div class="grid-cell">${item.unidade_medida || 'N/A'}</div>
      `;

      row.addEventListener('click', () => selecionarItem(row));
      grid.appendChild(row);
    });

  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    alert('Erro ao buscar itens.');
  }
}

function selecionarItem(row) {
  if (itemSelecionado) {
    itemSelecionado.classList.remove('selecionado');
  }

  itemSelecionado = row;
  itemSelecionado.classList.add('selecionado');
}

async function adicionarItem() {
  const descricao = document.querySelector('#Descrição').value.trim();
  const quantidade = document.querySelector('#Quantidade').value.trim();
  const observacao = document.querySelector('#Observação').value.trim();
  const unidade_medida = document.querySelector('#unidadeMedida').value.trim();
  const numRequisicao = document.querySelector('#numRequisicao').value;

  if (!descricao || !quantidade || !observacao || !unidade_medida || !numRequisicao) {
    return alert('Preencha todas as informações do item.');
  }

  if (isNaN(quantidade) || quantidade <= 0) {
    return alert('A quantidade precisa ser um número válido e maior que 0.');
  }

  const requisicao = {
    descricao,
    qtde: parseInt(quantidade),
    observacao,
    unidade_medida,
    num_requisicao: numRequisicao,
  };

  try {
    const response = await fetch('http://localhost:5500/api/requisicoesgrid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(requisicao),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar item');
    }

    alert('Item adicionado com sucesso!');
    fecharModal();
    buscarItens(); // Atualiza sem recarregar a página
  } catch (error) {
    console.error('Erro ao adicionar o item:', error);
    alert('Erro ao adicionar item.');
  }
}

async function removerItem() {
  if (!itemSelecionado) {
    return alert('Selecione um item para remover.');
  }

  const itemId = itemSelecionado.dataset.id;
  if (!itemId || isNaN(itemId)) {
    return alert('ID do item inválido.');
  }

  try {
    const response = await fetch(`http://localhost:5500/api/requisicoesgrid/remover/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao remover item');
    }

    alert('Item removido com sucesso!');
    itemSelecionado.remove();
    itemSelecionado = null;
  } catch (error) {
    console.error('Erro ao remover o item:', error);
    alert('Erro ao remover o item.');
  }
}

window.addEventListener('load', carregarRequisicoes);
window.addEventListener('load', buscarItens);
