document.addEventListener('DOMContentLoaded', async () => {
    await carregarProjetosERequisicoes();
    document.getElementById('btnPesquisar').addEventListener('click', atualizarCotacoesPorFiltros);
    
    // Pressionar Enter no campo de texto aciona a pesquisa
    document.getElementById('filtroTexto').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // evita submit padrão
            atualizarCotacoesPorFiltros();
        }
    });

    atualizarCotacoesPorFiltros(); // carrega tudo inicialmente com status 'pendente'
});

async function carregarProjetosERequisicoes() {
    try {
        const select = document.getElementById('filtroSelect');
        select.innerHTML = '<option value="">Todos os projetos/requisições</option>';

        const [resProj, resReq] = await Promise.all([
            fetch('http://localhost:5500/api/projetos'),
            fetch('http://localhost:5500/api/requisicoes')
        ]);

        if (!resProj.ok || !resReq.ok) throw new Error('Erro ao carregar dados');

        const projetos = await resProj.json();
        const requisicoes = await resReq.json();

        projetos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = `projeto-${p.cod_proj}`;
            opt.textContent = `Projeto: ${p.titulo || `Projeto ${p.cod_proj}`}`;
            select.appendChild(opt);
        });

        requisicoes.forEach(r => {
            const opt = document.createElement('option');
            opt.value = `requisicao-${r.num_requisicao}`;
            opt.textContent = `Requisição: ${r.num_requisicao}`;
            select.appendChild(opt);
        });
    } catch (err) {
        alert('Erro ao carregar dados: ' + err.message);
    }
}

function atualizarCotacoesPorFiltros() {
    const selectValor = document.getElementById('filtroSelect').value;
    const texto = document.getElementById('filtroTexto').value.toLowerCase();

    let projetoId = '', requisicaoId = '';

    if (selectValor.startsWith('projeto-')) {
        projetoId = selectValor.replace('projeto-', '');
    } else if (selectValor.startsWith('requisicao-')) {
        requisicaoId = selectValor.replace('requisicao-', '');
    }

    carregarCotacoes(projetoId, requisicaoId, texto);
}

async function carregarCotacoes(projetoId = '', requisicaoId = '', textoFiltro = '') {
    try {
        let url = 'http://localhost:5500/api/cotacoes/listar';
        const params = [];
        if (projetoId) params.push(`cod_proj=${projetoId}`);
        if (requisicaoId) params.push(`num_requisicao=${requisicaoId}`);
        if (params.length) url += '?' + params.join('&');

        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        const cotacoes = await res.json();

        const texto = textoFiltro.toLowerCase();
        const temFiltroAtivo = projetoId || requisicaoId || texto;

        const filtradas = cotacoes.filter(cot => {
            const camposParaBuscar = [
                cot.nomeArquivo,
                cot.projeto?.titulo,
                cot.projeto?.cod_proj,
                cot.requisicoes?.num_requisicao,
                cot.requisicoes?.descricao,
                cot.requisicoes?.solicitante,
                cot.status,
                cot.aprovadoPor,
                cot.recusadoPor
            ];

            const correspondeTexto = camposParaBuscar.some(campo =>
                campo?.toString().toLowerCase().includes(texto)
            );

            // Se não tiver filtro ativo, mostra só pendentes. Se tiver, mostra conforme o filtro/texto.
            return temFiltroAtivo ? correspondeTexto : cot.status === 'pendente';
        });

        const corpoTabela = document.querySelector('#tabelaCotacoes tbody');
        corpoTabela.innerHTML = '';

        if (filtradas.length === 0) return mostrarMensagemTabela('Nenhuma cotação encontrada.');

        filtradas.forEach(cot => {
            const linha = document.createElement('tr');
            const nomeArquivo = cot.nomeArquivo?.replace(/^\d+-/, '').trim() || 'Arquivo não informado';

            let statusHtml = '';
            let motivoRecusa = '';

            if (cot.status === 'aprovado') {
                statusHtml = `Aprovado por: ${cot.aprovadoPor} em ${new Date(cot.dataAprovacao).toLocaleString()}`;
            } else if (cot.status === 'recusado') {
                statusHtml = `Recusado por: ${cot.recusadoPor} em ${new Date(cot.dataRecusa).toLocaleString()}`;
                motivoRecusa = cot.motivorec || '';
            } else {
                statusHtml = `
                    <button onclick="aprovar(${cot.id})">Aprovar</button>
                    <button onclick="recusar(${cot.id})">Recusar</button>
                `;
            }

            linha.innerHTML = `
                <td><a href="/uploads/pendentes/${cot.nomeArquivo}" target="_blank">${nomeArquivo}</a></td>
                <td>${cot.projeto?.titulo || '-'}</td>
                <td>Requisição ${cot.requisicoes?.num_requisicao || '-'}</td>
                <td>${statusHtml}</td>
                <td>${motivoRecusa}</td>
            `;
            corpoTabela.appendChild(linha);
        });
    } catch (err) {
        mostrarMensagemTabela('Erro ao carregar cotações: ' + err.message);
    }
}

function mostrarMensagemTabela(msg) {
    const corpo = document.querySelector('#tabelaCotacoes tbody');
    corpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">${msg}</td></tr>`;
}

// Função para obter usuário logado, aprovar e recusar, como você já tinha.


async function obterUsuarioLogado() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado.');
        window.location.href = '/login';
        return null;
    }

    const response = await fetch('http://localhost:5500/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login';
        } else {
            alert('Erro ao obter usuário.');
        }
        return null;
    }

    return await response.json();
}

async function aprovar(id) {
    if (!confirm('Deseja aprovar esta cotação?')) return;
    const user = await obterUsuarioLogado();
    if (!user) return;

    try {
        const res = await fetch(`http://localhost:5500/api/cotacoes/aprovar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: user.nome_user })
        });

        if (!res.ok) throw new Error(await res.text());
        alert('Cotação aprovada com sucesso!');
        atualizarCotacoesPorFiltros();
    } catch (err) {
        alert('Erro ao aprovar: ' + err.message);
    }
}

async function recusar(id) {
    const modal = document.getElementById('modalRecusa');
    const motivoTextarea = document.getElementById('motivoRecusa');
    const confirmarBtn = document.getElementById('confirmarRecusa');
    const cancelarBtn = document.getElementById('cancelarRecusa');

    modal.style.display = 'flex';

    confirmarBtn.onclick = async () => {
        const motivo = motivoTextarea.value.trim();
        if (!motivo) return alert('Informe o motivo.');

        const user = await obterUsuarioLogado();
        if (!user) return;

        try {
            const res = await fetch(`http://localhost:5500/api/cotacoes/recusar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: user.nome_user, motivoRecusa: motivo })
            });

            if (!res.ok) throw new Error(await res.text());
            alert('Cotação recusada com sucesso!');
            atualizarCotacoesPorFiltros();
            modal.style.display = 'none';
        } catch (err) {
            alert('Erro ao recusar: ' + err.message);
        }
    };

    cancelarBtn.onclick = () => {
        modal.style.display = 'none';
    };
}
