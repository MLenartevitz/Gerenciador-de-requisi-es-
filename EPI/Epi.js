document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('EpiForm');

    async function carregarUsuarioLogado() {
        try {
            const user = document.getElementById('usuario');
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
            user.value = usuario.nome_user;
            user.setAttribute('data-cod_user', usuario.cod_user);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    function setDataAtual() {
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data').value = hoje;
    }

    function toggleCAInput(quantidadeInputId, caInputId) {
        const quantidade = document.getElementById(quantidadeInputId).value;
        const caInput = document.getElementById(caInputId);
        caInput.style.display = quantidade > 0 ? 'block' : 'none';
    }

    ['quantidadeOculos', 'quantidadeProtetor', 'quantidadeLuvas', 'quantidadeMascara'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            const caId = 'ca' + id.replace('quantidade', '');
            toggleCAInput(id, caId);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const cod_user = document.getElementById('usuario').getAttribute('data-cod_user');
        const data = document.getElementById('data').value;

        if (!cod_user || !data) {
            alert('Usuário e data são obrigatórios.');
            return;
        }

        // Quantidades (se não preenchido, considera 0)
        const quantidadeOculos = parseInt(document.getElementById('quantidadeOculos').value) || 0;
        const quantidadeProtetor = parseInt(document.getElementById('quantidadeProtetor').value) || 0;
        const quantidadeLuvas = parseInt(document.getElementById('quantidadeLuvas').value) || 0;
        const quantidadeMascara = parseInt(document.getElementById('quantidadeMascara').value) || 0;

        // Payload JSON
        const payload = {
            cod_user,
            data,
            quantidadeOculos,
            quantidadeProtetor,
            quantidadeLuvas,
            quantidadeMascara,
            caOculos: document.getElementById('caOculos').value.trim() || "-",
            caProtetor: document.getElementById('caProtetor').value.trim() || "-",
            caLuvas: document.getElementById('caLuvas').value.trim() || "-",
            caMascara: document.getElementById('caMascara').value.trim() || "-",
        };

        // Validação: impedir que envie tudo zerado
        const total = quantidadeOculos + quantidadeProtetor + quantidadeLuvas + quantidadeMascara;

        if (total === 0) {
            alert('Informe pelo menos a quantidade de um EPI.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/api/epi/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Cadastro de EPI registrado com sucesso!');
                form.reset();
                setDataAtual();
            } else {
                alert(`Erro: ${result.error || result.message}`);
            }
        } catch (error) {
            alert('Erro ao enviar os dados.');
            console.error('Erro ao enviar o formulário:', error);
        }
    });

    carregarUsuarioLogado();
    setDataAtual();
});
