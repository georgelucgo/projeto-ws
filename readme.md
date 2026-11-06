
# Sistema Distribuído de Pedidos

Projeto desenvolvido para a disciplina de Web Services do IFMS.

## Objetivo

Criar um sistema de pedidos utilizando três microsserviços independentes, com comunicação HTTP.

## Arquitetura

- Catálogo/Estoque (3001): gerencia produtos e reservas.
- Pedidos (3000): recebe pedidos e solicita reservas ao Catálogo.
- Notificações (3002): registra notificações de pedidos.

## Tecnologias

- Node.js
- TypeScript
- Express
- HTTP REST

## Como executar

Entre na pasta de cada serviço e execute:

npm install

Copie o conteúdo de `.env.example` para `.env`.

Depois execute:

npm run dev

Os três serviços devem ser iniciados em terminais separados.

## Endpoints

### Catálogo - Porta 3001

- GET /produtos
- GET /produtos/:id
- POST /produtos
- POST /produtos/:id/reservas

### Pedidos - Porta 3000

- POST /pedidos - Cria pedido após confirmar reserva
- GET /pedidos - Lista pedidos
- GET /pedidos/:id - Consulta pedido por ID

Variáveis de ambiente:
- PORT=3000
- CATALOG_URL=http://localhost:3001

A comunicação com Catálogo é feita via HTTP.
Pedidos retorna 400, 404, 409 ou 502 conforme a falha.

### Notificações - Porta 3002

- GET /health
- POST /notificacoes (Encontro 3)
- GET /notificacoes (Encontro 3)

## Regras de negócio

- Um pedido só é criado se o estoque permitir a reserva.
- Quantidades inválidas retornam 400.
- Produtos inexistentes retornam 404.
- Estoque insuficiente retorna 409.
- Uma falha na notificação não deve cancelar um pedido confirmado.

## Testes

Os endpoints são testados pelo Thunder Client.

Os dados são armazenados em memória.
