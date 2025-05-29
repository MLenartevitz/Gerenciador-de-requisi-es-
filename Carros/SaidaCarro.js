document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSaida');
    const mensagem = document.getElementById('mensagem');
    const obsSelect = document.getElementById('obsSelect');
    const obsInput = document.getElementById('obs');
    const campoOutro = document.getElementById('campoOutro');
    const kmInput = document.getElementById('km');

    const params = new URLSearchParams(window.location.search);
    const placaParam = params.get('placa');

    if (placaParam) {
        const select = document.getElementById('placa');
        const option = document.createElement('option');
        option.value = placaParam;
        option.textContent = placaParam;
        option.selected = true;
        select.appendChild(option);
    }

    async function carregarCarros() {
        try {
            const response = await fetch('http://localhost:5500/api/carro');
            const carros = await response.json();
            const select = document.getElementById('placa');

            select.innerHTML = '<option value="" disabled selected>Selecione</option>';

            carros
                .filter(c => c.status === 'ativo')
                .forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.placa.trim().toUpperCase();
                    opt.textContent = `${c.placa} - ${c.modelo}`;
                    select.appendChild(opt);
                });
        } catch (error) {
            console.error('Erro ao carregar carros:', error);
        }
    }

    async function carregarProjetos() {
        try {
            const response = await fetch('http://localhost:5500/api/projetos');
            const projetos = await response.json();

            obsSelect.innerHTML = '<option value="" disabled selected>Selecione um projeto</option>';

            projetos.forEach(proj => {
                const opt = document.createElement('option');
                opt.value = proj.titulo;
                opt.textContent = proj.titulo;
                obsSelect.appendChild(opt);
            });

            const outrosOpt = document.createElement('option');
            outrosOpt.value = 'outro';
            outrosOpt.textContent = 'Outros';
            obsSelect.appendChild(outrosOpt);
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        }
    }

    async function carregarUsuarioLogado() {
        try {
            const motorista = document.getElementById('motorista');
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Usuário não autenticado.');
                window.location.href = '../Login/Login.html';
                return;
            }

            const response = await fetch('http://localhost:5500/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const usuario = await response.json();

            motorista.value = usuario.nome_user;
            motorista.setAttribute('data-cod_user', usuario.cod_user);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    function setDataAtual() {
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data').value = hoje;
    }

    function setHoraAtual() {
        const agora = new Date();
        const hora = agora.toTimeString().slice(0, 5);
        document.getElementById('hora').value = hora;
    }

    obsSelect.addEventListener('change', () => {
        const outroSelecionado = obsSelect.value === 'outro';
        campoOutro.style.display = outroSelecionado ? 'block' : 'none';
        obsInput.required = outroSelecionado;
        if (!outroSelecionado) obsInput.value = obsSelect.value;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();

        const placa = document.getElementById('placa').value.trim().toUpperCase();
        const cod_user = document.getElementById('motorista').getAttribute('data-cod_user');
        const km = parseInt(kmInput.value);
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const data_controle = `${data}T${hora}`;
        const arquivo = document.getElementById('arquivoCotacao').files[0];
        const observacao = obsSelect.value === 'outro' ? obsInput.value : obsSelect.value;

        if (!placa || isNaN(km) || !data || !hora || !cod_user || !observacao) {
            mensagem.textContent = 'Preencha todos os campos obrigatórios.';
            mensagem.style.color = 'red';
            return;
        }

        formData.append('placa', placa);
        formData.append('cod_user', cod_user);
        formData.append('km', km);
        formData.append('data_controle', data_controle);
        formData.append('observacao', observacao);
        if (arquivo) formData.append('arquivoCotacao', arquivo);

        try {
            const response = await fetch('http://localhost:5500/api/controle/saida', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                mensagem.textContent = 'Saída registrada com sucesso!';
                mensagem.style.color = 'green';
                form.reset();
                setDataAtual();
                setHoraAtual();
            } else {
                mensagem.textContent = `Erro: ${result.erro || result.message}`;
                mensagem.style.color = 'red';
            }
        } catch (error) {
            mensagem.textContent = 'Erro ao enviar os dados.';
            mensagem.style.color = 'red';
        }
    });

    carregarCarros();
    carregarProjetos();
    carregarUsuarioLogado();
    setDataAtual();
    setHoraAtual();
});
