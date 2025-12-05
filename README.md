# 📘 FACE-LOCK
### 🔒 Bloqueio automático de tela utilizando reconhecimento facial — Open Source, offline e simples

### 🛠 História do Projeto

O **Face-Lock** nasceu a partir de uma reflexão sobre a história do criador do site Silk Road, Ross Ulbricht (DPR), e como ele foi preso, em parte, devido ao acesso não autorizado do FBI aos seus dados pessoais. Essa reflexão me levou a pensar sobre a importância da privacidade e da segurança digital. A ideia de um sistema de bloqueio automático de tela, baseado em reconhecimento facial, surgiu como uma forma de proteger a privacidade do usuário, impedindo o acesso de terceiros quando ele se afasta do computador.

A principal proposta do **Face-Lock** é oferecer uma solução de segurança **offline**, sem a necessidade de enviar imagens ou dados para a nuvem, garantindo a proteção dos dados pessoais diretamente no dispositivo. Em um mundo onde a privacidade digital é constantemente ameaçada, esta ferramenta visa oferecer uma camada extra de segurança com uma implementação simples e acessível.

O **Face-Lock** é uma ferramenta open source que bloqueia automaticamente a sessão do usuário quando ele se afasta do computador.  
Tudo ocorre **localmente**, usando modelos de visão computacional via **TensorFlow + FaceAPI**, sem enviar nenhuma imagem para a internet.

---

# 🚀 Funcionalidades

- 📷 Captura facial local e armazenamento seguro do *descriptor*  
- 🔍 Detecção contínua do usuário em frente à tela  
- ⏱ Bloqueio automático após um período configurável  
- 🔌 Funciona totalmente offline  
- 🧩 Código modular e simples de modificar  
- 🐧 Compatível com Linux (via `loginctl`)  
- ⚙️ Configuração via `config/default.json`  

---

# 📦 Instalação

## 1. Clone o repositório

git clone https://github.com/typedbywill/face-lock.git  
cd face-lock

## 2. Instale as dependências

npm install

## 3. Baixe os modelos da FaceAPI

Pasta esperada:
 /models

Modelos oficiais:  
https://github.com/vladmandic/face-api/tree/master/model

---

# ⚙️ Configuração

As configurações ficam em:

config/default.json

Exemplo:

{
  "modelPath": "./models",
  "descriptorFile": "./face_descriptor.json",
  "camera": {
    "width": 640,
    "height": 480
  },
  "monitor": {
    "delaySeconds": 5,
    "threshold": 0.6,
    "checkInterval": 500
  }
}

---

## 📝 Explicação dos parâmetros

- **modelPath** — caminho onde os modelos da FaceAPI estão armazenados  
- **descriptorFile** — arquivo onde o vetor facial é salvo após o cadastro  
- **camera.width / camera.height** — resolução da webcam utilizada  
- **monitor.delaySeconds** — tempo sem detectar o rosto antes de bloquear  
- **monitor.threshold** — limite de similaridade (quanto menor, mais restrito)  
- **monitor.checkInterval** — intervalo entre capturas da webcam  

Valores menores em *threshold* tornam o sistema mais rigoroso, exigindo maior similaridade com o rosto cadastrado.  

---

# 👤 Cadastro de Rosto

Antes de usar o bloqueio automático, é necessário registrar o rosto.

Execute:

npm run capture

O script irá:

1. Carregar os modelos  
2. Aguardar você posicionar-se diante da câmera  
3. Capturar a imagem  
4. Extrair o *face descriptor*  
5. Salvar no arquivo definido em `descriptorFile`  

Saída esperada:

Carregando modelos...  
Olhe para a câmera...  
Rosto cadastrado em face_descriptor.json

---

# 🔒 Iniciar o Auto-Bloqueio

Com o rosto já capturado, basta iniciar o monitor:

npm run autolock

Saída típica:

Carregando modelos...  
Monitorando...  
Usuário ausente — bloqueando…

O comando acionado é:

loginctl lock-session

---

# 🧱 Estrutura do Projeto

face-lock/  
├── src/  
│   ├── capture/  
│   │   └── index.js  
│   ├── autolock/  
│   │   └── index.js  
│   ├── utils/  
│   │   ├── camera.js  
│   │   ├── face.js  
│   │   ├── file.js  
│   │   └── system.js  
├── config/  
│   └── default.json  
├── models/  
├── face_descriptor.json  
└── README.md  

---

# 🛠 Como Funciona

1. A webcam é capturada em intervalos definidos  
2. O vetor facial é extraído via FaceAPI  
3. A distância euclidiana entre o rosto atual e o cadastrado é calculada  
4. Se a distância < threshold → usuário presente  
5. Se ultrapassar delaySeconds sem presença → bloqueia a sessão  

Nada é enviado para a nuvem.

---

# 🧩 Roadmap

- [ ] Suporte para desbloqueio automático  
- [ ] Compatibilidade com Windows  
- [ ] Compatibilidade com macOS  
- [ ] Interface gráfica (Electron)  
- [ ] Distribuição via npm (`npx face-lock`)  
- [ ] Múltiplos usuários  
- [ ] Otimizações de performance  

---

# 🤝 Como Contribuir

1. Fork  
2. Nova branch  
3. Commit  
4. Push  
5. PR  

---

# 🛡 Licença

Licença MIT — livre para uso pessoal, comercial e modificações.

---

# ⭐ Apoie o Projeto

- Dê uma estrela no GitHub  
- Compartilhe com amigos  
- Contribua com ideias e melhorias