async function carregarRequisicoes() {
  try {
    const response = await fetch('http://localhost:5500/api/requisicoes');
    const requisicoes = await response.json();
    const tabela = document.querySelector('#requisicaoTable tbody');

    tabela.innerHTML = '';
    requisicoes.forEach(req => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td><input type="checkbox" class="check-requisicao" value="${req.num_requisicao}"> ${req.num_requisicao}</td>
        <td><button onclick="excluirRequisicao(${req.num_requisicao})">Excluir</button> <button onclick="editarRequisicao(${req.num_requisicao})">Editar</button></td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error('Erro ao carregar requisições:', error);
  }
}

async function abrirModalComSelecionadas() {
  const checkboxes = document.querySelectorAll('.check-requisicao:checked');
  const lista = document.getElementById('listaDetalhes');
  lista.innerHTML = '';

  if (checkboxes.length === 0) {
    alert('Selecione pelo menos uma requisição.');
    return;
  }

  const table = document.createElement('table');
  table.classList.add('tabela-modal');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Número Requisição</th>
        <th>Item</th>
        <th>Data</th>
        <th>Solicitante</th>
        <th>Projeto</th>
        <th>Descrição</th>
        <th>Quantidade</th>
        <th>Observação</th>
        <th>Unidade de Medida</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  for (let checkbox of checkboxes) {
    const num_requisicao = checkbox.value;

    try {
      const response = await fetch(`http://localhost:5500/api/requisicoes/${num_requisicao}`);
      const dados = await response.json();

      const responses = await fetch(`http://localhost:5500/api/requisicoesgrid/${num_requisicao}`);
      const dados1 = await responses.json();

      if (dados1.itens && dados1.itens.length > 0) {
        dados1.itens.forEach((item, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${num_requisicao}</td>
            <td>${index + 1}</td>
            <td>${new Date(dados.data_requisicao).toLocaleDateString() || 'N/A'}</td>
            <td>${dados.cod_user} - ${dados.usuario?.nome_user || 'N/A'}</td>
            <td>${dados.cod_proj} - ${dados.projeto?.titulo || 'N/A'}</td>
            <td>${item.descricao || 'N/A'}</td>
            <td>${item.qtde || 'N/A'}</td>
            <td>${item.observacao || 'N/A'}</td>
            <td>${item.unidade_medida || 'N/A'}</td>

          `;
          tbody.appendChild(row);
        });
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${num_requisicao}</td>
          <td>1</td>
          <td>${new Date(dados.data_requisicao).toLocaleDateString() || 'N/A'}</td>
          <td>${dados.cod_user} - ${dados.usuario?.nome_user || 'N/A'}</td>
          <td>${dados.cod_proj} - ${dados.projeto?.titulo || 'N/A'}</td>
          <td colspan="4" style="text-align: center;">Nenhum item encontrado</td>
        `;
        tbody.appendChild(row);
      }
    } catch (error) {
      console.error(`Erro ao carregar requisição ${num_requisicao}:`, error);
    }
  }

  lista.appendChild(table);
  document.getElementById('modalDetalhes').style.display = 'flex';
}

function baixarLista() {
  const linhas = document.querySelectorAll(".tabela-modal tbody tr");
  const dados = [];

  linhas.forEach((linha) => {
    const colunas = linha.querySelectorAll("td");
    dados.push({
      NumeroRequisicao: colunas[0]?.innerText || '',
      Item: colunas[1]?.innerText || '',
      Data: colunas[2]?.innerText || '',
      Solicitante: colunas[3]?.innerText || '',
      Projeto: colunas[4]?.innerText || '',
      Descricao: colunas[5]?.innerText || '',
      Quantidade: colunas[6]?.innerText || '',
      Observacao: colunas[7]?.innerText || '',
      unidade_medida: colunas[8]?.innerText || '',
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detalhes");

  XLSX.writeFile(workbook, "detalhes_requisicoes.xlsx");
}

function fecharModal() {
  document.getElementById('modalDetalhes').style.display = 'none';
}

async function excluirRequisicao(num_requisicao) {
  if (confirm('Tem certeza que deseja excluir este requisicao?')) {
    try {
      const response = await fetch(`http://localhost:5500/api/requisicoes/${num_requisicao}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro ao requisicao: ${response.status} - ${response.statusText}`);
      }

      alert("requisicao excluído com sucesso!");
      carregarRequisicoes();
    } catch (error) {
      console.error('Erro ao excluir requisicao:', error);
      alert("Erro ao excluir requisicao! Verifique o console.");
    }
  }
}

async function editarRequisicao(num_requisicao) {
  try {
    const response = await fetch(`http://localhost:5500/api/requisicoes/${num_requisicao}`);
    const dados = await response.json();

    document.getElementById('editNumRequisicao').value = dados.num_requisicao;
    document.getElementById('editData').value = new Date(dados.data_requisicao).toISOString().split('T')[0];
    document.getElementById('editSolicitante').value = dados.rev_req;
    document.getElementById('editProjeto').value = dados.cod_proj;

    document.getElementById('modalEdicao').style.display = 'flex';
  } catch (error) {
    console.error('Erro ao buscar dados da requisição:', error);
  }
}

function fecharModalEdicao() {
  document.getElementById('modalEdicao').style.display = 'none';
}

async function carregarSelects() {
  try {
    // Carregar revisores
    const responseUsuarios = await fetch('http://localhost:5500/api/auth');
    const usuarios = await responseUsuarios.json();
    const selectRevisores = document.getElementById('editSolicitante');
    selectRevisores.innerHTML = '<option value="">Selecione</option>';
    usuarios.forEach(user => {
      const option = document.createElement('option');
      option.value = user.cod_user;
      option.text = `${user.cod_user} - ${user.nome_user}`;
      selectRevisores.appendChild(option);
    });

    // Carregar projetos
    const responseProjetos = await fetch('http://localhost:5500/api/projetos');
    const projetos = await responseProjetos.json();
    const selectProjetos = document.getElementById('editProjeto');
    selectProjetos.innerHTML = '<option value="">Selecione</option>';
    projetos.forEach(proj => {
      const option = document.createElement('option');
      option.value = proj.cod_proj;
      option.text = `${proj.titulo}`;
      selectProjetos.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar selects:', error);
  }
}


async function editarRequisicao(num_requisicao) {
  try {
    await carregarSelects();
    const response = await fetch(`http://localhost:5500/api/requisicoes/${num_requisicao}`);
    const dados = await response.json();

    document.getElementById('editNumRequisicao').value = dados.num_requisicao;
    document.getElementById('editData').value = new Date(dados.data_requisicao).toISOString().split('T')[0];
    document.getElementById('editSolicitante').value = dados.rev_req;
    document.getElementById('editProjeto').value = dados.cod_proj;

    document.getElementById('modalEdicao').style.display = 'flex';
  } catch (error) {
    console.error('Erro ao buscar dados da requisição:', error);
  }
}

document.getElementById('formEdicao').addEventListener('submit', async function (e) {
  e.preventDefault();

  const numRequisicao = document.getElementById('editNumRequisicao').value;
  const data = document.getElementById('editData').value;
  const revisor = document.getElementById('editSolicitante').value;
  const projeto = document.getElementById('editProjeto').value;

  try {
    const response = await fetch(`http://localhost:5500/api/requisicoes/${numRequisicao}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data_requisicao: data,
        rev_req: revisor,
        cod_proj: projeto
      })
    });

    if (!response.ok) throw new Error("Erro ao atualizar a requisição");

    alert('Requisição atualizada com sucesso!');
    fecharModalEdicao();
    carregarRequisicoes();
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    alert('Erro ao salvar edição!');
  }
});

window.addEventListener('load', carregarRequisicoes);
