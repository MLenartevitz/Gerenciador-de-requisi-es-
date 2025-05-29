function processarQRCode(codigo) {
  // Aqui, estamos pegando apenas a parte da placa, removendo qualquer URL anterior
  const placa = codigo.trim().toUpperCase().split('/').pop(); // Pega o valor após a última barra '/'
  
  console.log("Placa extraída:", placa); // Verifique se a placa está correta
  
  fetch(`http://localhost:5500/api/controle/status/${placa}`)
    .then(res => res.json())
    .then(dados => {
      if (!dados.veiculo) {
        alert("Veículo não encontrado.");
        return;
      }

      if (dados.status === "ativo") {
        // Redireciona para página de SAÍDA
        window.location.href = `/Saida/saida.html?${placa}`;
      } else if (dados.status === "em uso") {
        // Redireciona para página de RETORNO
        window.location.href = `/Retorno/retorno.html?${placa}`;
      } else {
        alert("Status do veículo desconhecido.");
      }
    })
    .catch(err => {
      console.error('Erro na verificação:', err);
      alert("Erro ao verificar veículo.");
    });
}


const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  decodedText => {
    html5QrCode.stop();
    processarQRCode(decodedText);
  }
);
