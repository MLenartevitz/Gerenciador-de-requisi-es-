document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCotacao');
  const mensagem = document.getElementById('mensagem');
  const radioButtons = document.querySelectorAll('input[name="envioTipo"]');
  const campoProjeto = document.getElementById('campoProjeto');
  const campoRequisicao = document.getElementById('campoRequisicao');

  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'projeto') {
        campoProjeto.style.display = 'block';
        campoRequisicao.style.display = 'none';
        document.getElementById('cod_requisicao').removeAttribute('required');
        document.getElementById('cod_proj').setAttribute('required', true);
      } else {
        campoProjeto.style.display = 'none';
        campoRequisicao.style.display = 'block';
        document.getElementById('cod_proj').removeAttribute('required');
        document.getElementById('cod_requisicao').setAttribute('required', true);
      }
    });
  });

  async function carregarProjetos() {
    const response = await fetch('http://localhost:5500/api/projetos');
    const projetos = await response.json();
    const select = document.getElementById('cod_proj');
    select.innerHTML = '<option value="" disabled selected>Selecione</option>';
    projetos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.cod_proj;
      opt.textContent = p.titulo;
      select.appendChild(opt);
    });
  }

  async function carregarRequisicoes() {
    const response = await fetch('http://localhost:5500/api/requisicoes');
    const requisicoes = await response.json();
    const select = document.getElementById('cod_requisicao');
    const hiddenInput = document.getElementById('cod_proj_from_requisicao'); // input oculto

    select.innerHTML = '<option value="" disabled selected>Selecione</option>';
    requisicoes.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.num_requisicao;
      opt.textContent = r.num_requisicao;
      opt.dataset.codProj = r.cod_proj; // Certifique-se de que r.cod_proj está no JSON
      select.appendChild(opt);
    });

    // Atualiza campo oculto com cod_proj quando seleciona uma requisição
    select.addEventListener('change', () => {
      const selectedOption = select.options[select.selectedIndex];
      hiddenInput.value = selectedOption.dataset.codProj || '';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Adicionando o valor do cod_proj de forma correta
    const cod_proj_from_requisicao = document.getElementById('cod_proj_from_requisicao').value;
    const cod_proj = document.getElementById('cod_proj').value;

    // Adiciona o valor correto de cod_proj ou cod_proj_from_requisicao no formData
    if (cod_proj_from_requisicao) {
      formData.set('cod_proj', cod_proj_from_requisicao);
    } else if (cod_proj) {
      formData.set('cod_proj', cod_proj);
    }

    try {
      const res = await fetch('http://localhost:5500/api/cotacoes/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(mensagem.textContent = data.message)
      } else {
        alert(        
        mensagem.textContent = data.message,
        form.reset())
      }
    } catch (err) {
      alert(mensagem.textContent = 'Erro ao enviar.')
    }
  });


  carregarProjetos();
  carregarRequisicoes();
});
