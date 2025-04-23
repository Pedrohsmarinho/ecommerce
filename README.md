# API E-commerce

API REST para sistema de gerenciamento de e-commerce desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## Funcionalidades

- Autenticação de usuários (JWT)
- Verificação de email
- Gestão de usuários (Admin/Cliente)
- Gestão de produtos
- Gestão de pedidos
- Carrinho de compras
- Relatórios de vendas
- Documentação com Swagger

## Requisitos

- Node.js >= 14
- PostgreSQL >= 12
- NPM ou Yarn

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/your-username/ecommerce.git
    cd ecommerce
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure as variáveis de ambiente:
    - Copie o arquivo `.env.example` para `.env`
    - Preencha as variáveis com suas configurações
4. Execute as migrações do banco de dados:
    ```bash
    npm run migrate
    ```
5. Inicie o servidor:
    ```bash
    npm run dev
    ```

## Documentação da API

A documentação da API está disponível em:
    ```
    http://localhost:3000/api-docs
    ```

## Estrutura do Projeto

```
src/
  ├── config/         # Configurações
  ├── controllers/    # Controladores
  ├── middlewares/    # Middlewares
  ├── routes/         # Rotas
  ├── services/       # Serviços
  ├── utils/          # Utilitários
  └── app.js         # Configuração do Express
prisma/
  ├── migrations/    # Migrações do banco
  └── schema.prisma # Schema do Prisma
```

## Scripts

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run migrate`: Executa as migrações do banco de dados

## Endpoints

### Usuários
- POST /users/register - Registro de usuário
- GET /users/verify-email - Verificação de email
- POST /users/login - Login

### Produtos
- GET /products - Lista produtos
- POST /products - Cria produto (Admin)
- PUT /products/:id - Atualiza produto (Admin)
- DELETE /products/:id - Remove produto (Admin)

### Pedidos
- GET /orders - Lista pedidos do usuário
- POST /orders - Cria pedido
- PUT /orders/:id/status - Atualiza status (Admin)

### Carrinho
- GET /cart - Lista itens do carrinho
- POST /cart - Adiciona item ao carrinho
- PUT /cart/:id - Atualiza quantidade
- DELETE /cart/:id - Remove item

### Relatórios
- GET /reports/sales - Gera relatório de vendas (Admin)

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For questions or feedback, please contact [pedrohsmarinho@outlook.com].