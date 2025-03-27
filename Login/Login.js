document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const requiredFields = form.querySelectorAll('input[required]');

    form.addEventListener('input', function() {
      const allFilled = Array.from(requiredFields).every(field => field.value.trim() !== '');
      submitBtn.disabled = !allFilled;
    });
  });

  async function fazerLogin(event) {
    event.preventDefault();

    const cod_user = document.getElementById('codigo').value; 
    const senha = document.getElementById('senha').value;

    if (!cod_user || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    console.log('Tentando login com:', { cod_user, senha });

    try {
      const response = await fetch('http://localhost:5500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cod_user, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido ao fazer login');
      }

      console.log('Login bem-sucedido:', data);

      // Salvar o token no localStorage para manter a sessão
      localStorage.setItem('token', data.token);
      
      // Redireciona para a página inicial após o login
      window.location.href = '../Home/Home.html';

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login: ' + error.message);
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

  