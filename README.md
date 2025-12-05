# 📘 FACE-LOCK
### 🔒 Bloqueio automático de tela utilizando reconhecimento facial — Open Source, offline e simples

### 🛠 História do Projeto

O Face-Lock nasceu a partir de uma reflexão sobre a história do criador do site Silk Road, Ross Ulbricht (DPR), e como ele foi preso, em parte, devido ao acesso não autorizado do FBI aos seus dados pessoais. Essa reflexão me levou a pensar sobre a importância da privacidade e da segurança digital. A ideia de um sistema de bloqueio automático de tela baseado em reconhecimento facial surgiu como uma forma de proteger a privacidade do usuário, impedindo o acesso de terceiros quando ele se afasta do computador.

A principal proposta do Face-Lock é oferecer uma solução de segurança totalmente offline, sem enviar imagens ou dados para a nuvem, garantindo que todo o processamento seja feito localmente. Em um mundo onde a privacidade digital é constantemente ameaçada, esta ferramenta fornece uma camada extra de segurança com implementação simples, acessível e auditável.

O Face-Lock é uma ferramenta open source que bloqueia automaticamente a sessão do usuário quando ele se afasta do computador.  
Tudo acontece localmente, utilizando modelos de visão computacional via TensorFlow + FaceAPI.

-------------------------------------------------------------------------------

# 🚀 Funcionalidades

- 📷 Captura facial local e armazenamento seguro do descriptor
- 🔍 Detecção contínua do usuário em frente à tela
- ⏱ Bloqueio automático após um período configurável
- 🔌 Funciona totalmente offline
- 🧩 Arquitetura modular
- 🐧 Compatível com Linux
- 🪟 Compatível com Windows
- 🍎 Compatível com macOS
- 🧪 Suporte a comando customizado (qualquer sistema)
- ⚙️ Configuração via config/default.json

-------------------------------------------------------------------------------

# 📦 Instalação

## 1. Clone o repositório
git clone https://github.com/typedbywill/face-lock.git  
cd face-lock

## 2. Instale as dependências
npm install

## 3. Baixe os modelos da FaceAPI

Pasta esperada: /models  
Modelos oficiais:  
https://github.com/vladmandic/face-api/tree/master/model

-------------------------------------------------------------------------------

# ⚙️ Configuração

As configurações ficam em config/default.json.

Exemplo:

{
  "modelPath": "./models",
  "descriptorFile": "./face_descriptor.json",

  "lock": {
    "mode": "auto",
    "lockCommand": null
  },

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

-------------------------------------------------------------------------------

## 📝 Explicação dos parâmetros

### 🔐 Bloqueio de tela (multi-plataforma)

- lock.mode  
  - "auto" → detecta o sistema operacional automaticamente  
  - "command" → executa o comando definido em lockCommand  

- lock.lockCommand  
  - Comando customizável para bloquear a sessão  
  - Útil em distribuições Linux específicas ou SOs alternativos

Exemplos:

Linux: "gnome-screensaver-command -l"  
Windows: "rundll32.exe user32.dll,LockWorkStation"  
macOS: "pmset displaysleepnow"

### 📷 Webcam
- modelPath — onde estão os modelos da FaceAPI  
- descriptorFile — onde o vetor facial é salvo  
- camera.width / camera.height — tamanho da captura

### ⏱ Monitoramento
- monitor.delaySeconds — tempo sem detectar o rosto antes de bloquear  
- monitor.threshold — limite de similaridade facial  
- monitor.checkInterval — tempo entre verificações

-------------------------------------------------------------------------------

# 🖥️ Suporte a Sistemas Operacionais

### Linux
Comando nativo: loginctl lock-session  
Detectado automaticamente no modo "auto".

### Windows
Comando nativo: rundll32.exe user32.dll,LockWorkStation

### macOS
Comando nativo: AppleScript ou pmset

### Custom
Permite usar qualquer comando:
{
  "lock": {
    "mode": "command",
    "lockCommand": "meu_comando_de_bloqueio"
  }
}

-------------------------------------------------------------------------------

# 👤 Cadastro de Rosto

Antes de iniciar o monitoramento, registre seu rosto:

npm run face:add -- SEU_NOME

O processo:
1. Carrega os modelos  
2. Espera você ficar em frente à câmera  
3. Captura o quadro  
4. Extrai o descriptor  
5. Salva no arquivo configurado  

Exemplo de saída:
Carregando modelos...  
Olhe para a câmera...  
Rosto cadastrado em face_descriptor.json

-------------------------------------------------------------------------------

# 🔒 Iniciar o Auto-Bloqueio

Com o rosto cadastrado:

npm run autolock

Saída típica:
Carregando modelos...  
Monitorando...  
Usuário ausente — bloqueando…

-------------------------------------------------------------------------------

# 🧱 Estrutura do Projeto

face-lock/
├── src/
│   ├── capture/
│   ├── autolock/
│   ├── session/      (Linux, Windows, macOS, Custom)
│   ├── core/
│   └── utils/
├── config/
├── models/
└── face_descriptor.json

-------------------------------------------------------------------------------

# 🛠 Como Funciona

1. A webcam captura quadros periodicamente  
2. O rosto é detectado e convertido para um descriptor  
3. A distância euclidiana entre o rosto atual e o cadastrado é calculada  
4. Se a distância for menor que o threshold → usuário presente  
5. Caso contrário, se delaySeconds for ultrapassado → bloqueio automático  
6. O bloqueio usa módulo nativo ou comando customizado  

Nenhuma imagem é enviada para a internet.

-------------------------------------------------------------------------------

# 🧩 Roadmap

- [ ] Suporte para desbloqueio automático  
- [ ] Interface gráfica (Electron)  
- [ ] Distribuição via npx face-lock  
- [ ] Suporte a múltiplos usuários  
- [ ] Otimizações de performance  

-------------------------------------------------------------------------------

# 🤝 Como Contribuir

1. Fork  
2. Nova branch  
3. Commit  
4. Push  
5. PR  

-------------------------------------------------------------------------------

# ❤️ Doações

Se você quiser apoiar o desenvolvimento contínuo do Face-Lock, você pode contribuir via PIX:

#### [Doar 5 reais para typedbywill](https://nubank.com.br/cobrar/o9pkx/65e4f65a-e7a0-40fd-9ab8-16e7efe24141)

Toda ajuda é bem-vinda e incentiva a evolução do projeto! 🙌

-------------------------------------------------------------------------------

# 🛡 Licença

MIT — livre para uso pessoal, comercial e modificações.

-------------------------------------------------------------------------------

# ⭐ Apoie o Projeto

- Deixe uma estrela no GitHub  
- Compartilhe com amigos  
- Contribua com ideias e melhorias