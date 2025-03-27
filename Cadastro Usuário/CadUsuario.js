    async function cadastrarUsuario(event) {
        event.preventDefault();

    // Coletando os dados do formulário de maneira correta
    const nome_user = document.getElementById('nome').value;
    const funcao = document.getElementById('funcao').value;
    const senha = document.getElementById('senha').value;
    const senhaConfirm = document.getElementById('senha-confirm').value;
    const data_inicio = document.getElementById('data').value;

    // Verificar se as senhas coincidem
    if (senha !== senhaConfirm) {
        alert('As senhas não coincidem!');
    return;
      }

    // Definindo ativo como true por padrão, ou pegar o valor de um checkbox (se houver)
    const ativo = true;

    const cadastroData = {
        nome_user,
        funcao,
        senha,
        data_inicio,
        ativo,
      };

    try {
        // Enviando a requisição para o backend
        const response = await fetch('http://localhost:5500/api/auth/register', {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json',
          },
    body: JSON.stringify(cadastroData),
        });

    const data = await response.json();

    if (response.ok) {
        // Exibe a resposta de sucesso
        document.getElementById('responseMessage').innerHTML =
        `Usuário criado com sucesso! Código gerado: ${data.user.cod_user}`;
    alert(`Cadastro realizado com sucesso! Código gerado: ${data.user.cod_user}`);
    window.location.href = '../Login/login.html'; // Redireciona para a página de login
        } else {
        // Exibe erro
        document.getElementById('responseMessage').innerHTML = `Erro: ${data.error}`;
        }
      } catch (error) {
        console.error('Erro ao fazer cadastro:', error);
    document.getElementById('responseMessage').innerHTML = 'Erro ao cadastrar usuário. Tente novamente.';
      }
    }

    function togglePassword(inputId, iconId) {
      var passwordField = document.getElementById(inputId);
    var eyeIcon = document.getElementById(iconId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
    eyeIcon.src = "../img/eyeopen.png";
      } else {
        passwordField.type = "password";
    eyeIcon.src = "../img/eye.png";
      }
    }

