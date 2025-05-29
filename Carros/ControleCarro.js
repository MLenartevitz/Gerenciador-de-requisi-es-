async function carregarTabelaVeiculos() {
  try {
    const resposta = await fetch('http://localhost:5500/api/controle');
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const eventos = await resposta.json();
    const corpoTabela = document.getElementById('corpoTabela');
    if (!corpoTabela) {
      console.error('Elemento corpoTabela não encontrado.');
      return;
    }

    corpoTabela.innerHTML = '';

    // Ordenar todos os eventos pela data da saída (data_controle)
    eventos.sort((a, b) => new Date(a.data_controle) - new Date(b.data_controle));

    const filaSaida = []; // Fila para armazenar saídas

    eventos.forEach(evento => {
      const tipo = evento.tipo_evento;

      if (tipo === true || tipo === 1 || tipo === "1") {
        // Saída → adiciona na fila
        filaSaida.push(evento);
      } else if (tipo === false || tipo === 0 || tipo === "0") {
        // Retorno → emparelha com a saída correspondente pela placa
        const saidaIndex = filaSaida.findIndex(saida => saida.placa === evento.placa); // Procurar saída pela placa

        if (saidaIndex !== -1) {
          const saida = filaSaida.splice(saidaIndex, 1)[0]; // Remove a saída correspondente à placa

          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td>${(saida?.placa || evento.placa)} - ${(saida?.modelo || evento.modelo)}</td>
            <td>${(saida?.nome_user || evento.nome_user)}</td>
            <td>${saida ? formatarData(saida.data_controle) : ''}</td>
            <td>${saida ? formatarHora(saida.data_controle) : ''}</td>
            <td>
              ${saida?.km || ''} 
              ${saida?.nomeArquivo ? `<a href="/uploads/controle/${saida.nomeArquivo}" target="_blank" title="Ver anexo"> 📎</a>` : ''}
            </td>
            <td>${formatarData(evento.data_controle)}</td>
            <td>${formatarHora(evento.data_controle)}</td>
            <td>
              ${evento.km}
              ${evento.nomeArquivo ? `<a href="/uploads/controle/${evento.nomeArquivo}" target="_blank" title="Ver anexo"> 📎</a>` : ''}
            </td>
            <td>${saida?.observacao || '-'}</td>
            <td>${evento.observacao || '-'}</td>
          `;

          corpoTabela.appendChild(linha);
        } else {
          console.warn(`Não encontrou saída correspondente para o retorno com placa ${evento.placa}`);
        }
      } else {
        console.warn('tipo_evento inválido:', evento);
      }
    });

    // Se sobraram saídas sem retorno, exibir elas no final
    filaSaida.forEach(saida => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${saida.placa} - ${saida.modelo}</td>
        <td>${saida.nome_user}</td>
        <td>${formatarData(saida.data_controle)}</td>
        <td>${formatarHora(saida.data_controle)}</td>
        <td>
          ${saida.km}
          ${saida.nomeArquivo ? `<a href="/uploads/controle/${saida.nomeArquivo}" target="_blank" title="Ver anexo"> 📎</a>` : ''}
        </td>
        <td></td><td></td><td></td>
        <td>${saida.observacao || '-'}</td><td>-</td>
      `;
      corpoTabela.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao carregar a tabela:', erro);
  }
}

function formatarData(dataIso) {
  if (!dataIso) return '';
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR');
}

function formatarHora(dataIso) {
  if (!dataIso) return '';
  const data = new Date(dataIso);
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

window.addEventListener('DOMContentLoaded', carregarTabelaVeiculos);
