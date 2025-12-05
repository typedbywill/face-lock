# 📘 FACE-LOCK

### 🔒 Bloqueio automático de tela utilizando reconhecimento facial — Open Source, offline e simples.

> **Agora com Interface Gráfica (Electron)!**

### 🛠 História do Projeto

O Face-Lock nasceu a partir de uma reflexão sobre a história do criador do site Silk Road, Ross Ulbricht (DPR), e como ele foi preso, em parte, devido ao acesso não autorizado do FBI aos seus dados pessoais. Essa reflexão me levou a pensar sobre a importância da privacidade e da segurança digital. A ideia de um sistema de bloqueio automático de tela baseado em reconhecimento facial surgiu como uma forma de proteger a privacidade do usuário, impedindo o acesso de terceiros quando ele se afasta do computador.

A principal proposta do Face-Lock é oferecer uma solução de segurança totalmente offline, sem enviar imagens ou dados para a nuvem, garantindo que todo o processamento seja feito localmente. Em um mundo onde a privacidade digital é constantemente ameaçada, esta ferramenta fornece uma camada extra de segurança com implementação simples, acessível e auditável.

---

# 🚀 Funcionalidades

- **📷 Interface Gráfica Moderna**: Dashboard visual para monitoramento e gestão.
- **🛡️ Privacidade Total**: Captura e processamento 100% offline.
- **🔍 Detecção Contínua**: Monitora a presença do usuário em tempo real.
- **⏱ Bloqueio Automático**: Bloqueia a tela após período configurável de ausência.
- **🐧 Multi-plataforma**: Suporte experimental para Linux, Windows e macOS.
- **🧩 Arquitetura Modular**: Código organizado em camadas (Clean Architecture).

---

# 📦 Instalação

## 1. Clone o repositório
```bash
git clone https://github.com/typedbywill/face-lock.git  
cd face-lock
```

## 2. Instale as dependências
```bash
npm install
```

## 3. Rebuild de Módulos Nativos (Electron)
```bash
npm run rebuild
```
Isso é necessário para compilar o TensorFlow e Canvas para o ambiente Electron.

## 4. Modelos da FaceAPI
Certifique-se de que a pasta `/models` contenha os arquivos de modelo necessários (já incluídos no repositório ou baixados via script).

---

# 🖥️ Como Usar

### ➤ Modo Interface Gráfica (Recomendado)
Inicia o aplicativo Desktop com dashboard visual.
```bash
npm run dev
```

### ➤ Modo CLI (Legado/Servidor)
Inicia apenas o processo de monitoramento no terminal.
```bash
npm run autolock
```

---

# ⚙️ Configuração

As configurações ficam em `config/default.json`. Você pode ajustar sensibilidade, tempo de bloqueio e câmera.

```json
{
  "camera": {
    "width": 640,
    "height": 480
  },
  "monitor": {
    "delaySeconds": 5,     // Tempo (s) ausente antes de bloquear
    "threshold": 0.6,      // Sensibilidade (menor = mais estrito)
    "checkInterval": 500   // Frequência de checagem (ms)
  }
}
```

---

# 🧱 Estrutura do Projeto (Nova Arquitetura)

O projeto foi refatorado seguindo princípios de **Clean Architecture**:

```
src/
├── domain/            # Regras de negócio puras (PresenceTracker)
├── application/       # Casos de uso e orquestração (MonitorService)
├── infrastructure/    # Implementações concretas (Camera, FaceAPI, System Lock)
├── electron/          # Processo Principal do Electron
├── ui/                # Frontend React + TailwindCSS
└── main/              # Composition Root (Injeção de Dependências)
```

---

# 👤 Gestão de Usuários

Você pode gerenciar rostos diretamente pela Interface Gráfica (`npm run dev`) ou via linha de comando:

- **Adicionar Rosto**: `npm run face:add -- "Nome"`
- **Listar Rostos**: `npm run face:list`
- **Remover Rosto**: `npm run face:remove -- "ID ou Nome"`

---

# 🧩 Roadmap

- [x] Arquitetura Modular (Clean Arch)
- [x] Interface Gráfica (Electron + React)
- [x] Suporte a múltiplos usuários
- [ ] Empacotamento (.deb, .exe)
- [ ] Suporte a desbloqueio automático

---

# 🤝 Como Contribuir

1. Fork
2. Nova branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Add: nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Open PR

---

# ❤️ Doações

Se você quiser apoiar o desenvolvimento contínuo do Face-Lock:

#### [Doar 5 reais para typedbywill](https://nubank.com.br/cobrar/o9pkx/65e4f65a-e7a0-40fd-9ab8-16e7efe24141)

---

# 🛡 Licença

MIT — livre para uso pessoal, comercial e modificações.