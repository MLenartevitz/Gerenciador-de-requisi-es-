document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRetorno');
    const mensagem = document.getElementById('mensagem');

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
                .filter(c => c.status === 'em uso')
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

            if (usuario && usuario.cod_user) {
                motorista.value = usuario.nome_user;
                motorista.setAttribute('data-cod_user', usuario.cod_user);
            } else {
                alert('Erro ao carregar usuário.');
            }
        } catch (error) {
            alert('Erro ao carregar usuário.');
        }
    }

    function setDataAtual() {
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data').value = hoje;
    }

    function setHoraAtual() {
        const agora = new Date();
        const hora = String(agora.getHours()).padStart(2, '0');
        const minuto = String(agora.getMinutes()).padStart(2, '0');
        document.getElementById('hora').value = `${hora}:${minuto}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();

        const placa = document.getElementById('placa').value.trim().toUpperCase();
        const cod_user = document.getElementById('motorista').getAttribute('data-cod_user');
        const km = parseInt(document.getElementById('km').value);
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const data_controle = `${data}T${hora}`;
        const observacao = document.getElementById('obs').value;
        const arquivo = document.getElementById('arquivoCotacao').files[0];

        if (!placa || !cod_user || isNaN(km) || !data || !hora) {
            mensagem.textContent = 'Preencha todos os campos obrigatórios.';
            mensagem.style.color = 'red';
            return;
        }

        formData.append('placa', placa);
        formData.append('cod_user', cod_user);
        formData.append('km', km);
        formData.append('data_controle', data_controle);
        formData.append('observacao', observacao || '-');
        if (arquivo) formData.append('arquivoCotacao', arquivo);

        try {
            const response = await fetch('http://localhost:5500/api/controle/retorno', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                mensagem.textContent = 'Retorno registrado com sucesso!';
                mensagem.style.color = 'green';
                form.reset();
                setDataAtual();
                setHoraAtual();
                carregarUsuarioLogado();
                carregarCarros();
            } else {
                mensagem.textContent = result.erro || 'Erro ao enviar o formulário.';
                mensagem.style.color = 'red';
            }
        } catch (error) {
            mensagem.textContent = 'Erro ao enviar. Verifique sua conexão.';
            mensagem.style.color = 'red';
        }
    });

    setHoraAtual();
    setDataAtual();
    carregarCarros();
    carregarUsuarioLogado();
});
