import React, { useState } from 'react';

const Form = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // Função para autenticar com o Google API
  const authenticateWithGoogle = async () => {
    // Carregar a biblioteca do cliente da API do Google
    const { gapi } = window;
    
    // Inicializar o cliente do Google API com o Client ID
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'AIzaSyCkkR6BivAJOxspbbBNzx3gReAu7exm4TQ', // Chave de API não será usada aqui, pois é OAuth2 agora
        clientId: '870999643816-b4631ac1pf4a6mmsugnsic4a0kqgmkmq.apps.googleusercontent.com', // Substitua com seu Client ID
        scope: 'https://www.googleapis.com/auth/spreadsheets', // Permissões para acessar o Google Sheets
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      });

      // Realizar o login
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      console.log('Usuário autenticado');
    });
  };

  // Função para enviar os dados para o Google Sheets após a autenticação
  const handleSubmit = async (event) => {
    event.preventDefault();

    await authenticateWithGoogle(); // Autenticação

    const sheetId = '1uwNC1qxo4msHPCB74wrdNbE5-BcfRaMohnUALxihM2I'; // Substitua pelo ID da sua planilha
    const range = 'Sheet1!A:A'; // Nome da aba e o intervalo onde você quer armazenar os dados (no caso, coluna A da aba "Sheet1")

    const data = {
      values: [
        [message], // A mensagem será registrada em uma nova linha
      ],
    };

    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      resource: data,
    });

    if (response.status === 200) {
      setStatus('Mensagem registrada com sucesso!');
      setMessage(''); // Limpar o campo de mensagem após o envio
    } else {
      setStatus('Erro ao registrar a mensagem');
      console.error('Erro ao registrar a mensagem:', response);
    }
  };

  return (
    <div>
      <h1>Formulário de Mensagens</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Mensagem:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Form;
