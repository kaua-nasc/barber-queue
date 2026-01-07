# Barber Queue - Sistema de Gestão de Filas

Um sistema moderno e em tempo real para gerenciamento de filas de barbearia. Permite que clientes entrem na fila remotamente e acompanhem sua posição, enquanto o barbeiro gerencia o fluxo, serviços e faturamento através de um painel administrativo.

## Funcionalidades

### Para o Cliente (Público)
- **Fila em Tempo Real:** Visualização da posição atual e estimativa de tempo de espera.
- **Auto-Atendimento:** O cliente coloca seu nome e seleciona os serviços desejados.
- **Status da Barbearia:** Indicador visual de "Aberto/Fechado" baseado no horário ou controle manual.
- **Informações Úteis:** Visualização dos horários de funcionamento da semana e avisos importantes (ex: "Férias", "Promoções").
- **Persistência de Sessão:** O cliente não perde o lugar na fila se fechar o navegador.

### Painel Administrativo
- **Gestão de Fila:** Visualizar quem está na cadeira, próximos da fila, finalizar ou remover atendimentos.
- **Controle Financeiro:** Relatório diário de faturamento e contagem de clientes.
- **Configurações Dinâmicas:**
  - **Serviços:** Adicionar/Editar/Remover serviços e preços.
  - **Horários:** Configurar horário de abertura e fechamento para cada dia da semana.
  - **Avisos:** Criar banners de alerta (Info, Alerta, Sucesso) visíveis na home.
  - **Status:** Abrir ou fechar a fila manualmente.

## Tecnologias Utilizadas

Este projeto foi construído com foco em performance, experiência do usuário e código limpo.

- **Frontend:** [React](https://react.dev/) (v19) com [React Router v7](https://reactrouter.com/) para roteamento moderno.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para tipagem estática e segurança.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para design responsivo e ágil.
- **Backend as a Service (BaaS):** [Firebase](https://firebase.google.com/)
  - **Realtime Database:** Para sincronização instantânea da fila e configurações.
  - **Authentication:** Para segurança do painel administrativo.
- **Ícones:** SVG Icons personalizados.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Conta no Firebase

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/kaua-nasc/barber-queue.git
   cd barber-queue
2. **Configurar Variáveis de Ambiente**

   Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Firebase Realtime Database.
4. **Instalar Dependências e Iniciar**

   ```bash
   # Instala as dependências usando Bun
   bun install

   # Inicia o servidor de desenvolvimento
   bun dev
