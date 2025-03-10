# Sonder Hub - Interface do Cliente
https://main.d21ki34dfffbak.amplifyapp.com/

## Visão Geral
A interface do cliente permite que os usuários explorem o ginásio, acessem planos de treino personalizados, realizem pagamentos e muito mais, tudo de forma intuitiva, consoante os dados escrito no painel administrativo [PAINEL ADMINISTRATIVO](https://github.com/tsilmak/Final-Project-PAP-Gym-Admin).

## Tecnologias Utilizadas
A interface do cliente foi desenvolvida utilizando as seguintes tecnologias:

- **Linguagens de Programação**: TypeScript
- **Frameworks e Bibliotecas**:
  - React (Front-end)
  - Redux RTK para gerenciamento de estado
  - Redux Toolkit Query para chamadas assíncronas de API
  - Tailwind CSS para estilização
- **Banco de Dados**: PostgreSQL
- **Ambiente de Desenvolvimento**:
  - Node.js
  - Vite

## Funcionalidades
A interface do cliente do Sonder Hub inclui:

- **Exploração do Ginásio**: Apresentação do ginásio, mapa de aulas e visualização de equipamentos.
- **Gestão de Conta**: Registro, login e gerenciamento de informações pessoais.
- **Planos de Treino**: Acesso a planos de treino personalizados e criação de treinos.
- **Pagamentos e Assinaturas**: Realização de pagamentos via Stripe, gerenciamento de assinaturas.
- **Interação e Conteúdo**: Leitura de blogs informativos e comunicação com treinadores.

## Instalação e Configuração
Para visualizar o painel de cliente localmente, siga os seguintes passos:

1. Clone o repositório:
   ```sh
   git clone https://github.com/tsilmak/Final-Project-PAP-Gym-Client.git
   cd Final-Project-PAP-Gym-Client
   ```
2. Instale as dependências no servidor e no cliente:
   ```sh
   cd client
   npm install

   cd server
   npm install
   ```
3. Configure as variáveis de ambiente seguindo o exemplo em `.env.example` (pasta client):
   ```env
   # Base API URL for backend services
    VITE_BASE_API_URL=http://localhost:8002

    # Frontend application URL
    VITE_URL=http://localhost:5173

    # Stripe public key for payments processing
    VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX

   ```
   
3. Configure as variáveis de ambiente seguindo o exemplo em `.env.example` (pasta server):
   ```env
     # Configurações do Banco de Dados
    DATABASE_URL=postgresql://USER:PASSWD@localhost:5432/sonderhub
    PRISMA_DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DB?schema=public"

    # Configurações do Servidor
    PORT=8002
    NODE_ENV="development"

    # Segurança e Autenticação
    JWT_SECRET=sua_chave_secreta
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    SECRET=your_secret_key

    # Chave Stripe para processar pagamentos
    STRIPE_KEY=your_stripe_key
   
    # Configurações de CORS (Cross-Origin Resource Sharing)
    CORS_ORIGIN=http://localhost:5173

   ```
   
4. Execute o projeto em modo de desenvolvimento no cliente e no servidor:
   ```sh
   cd client
   npm run dev

   cd server
   npm run dev
   ```
5. A interface do cliente estará disponível em `http://localhost:5173`
   
