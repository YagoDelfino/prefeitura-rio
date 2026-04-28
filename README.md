# Painel de Vulnerabilidade Infantil

Aplicação full-stack para acompanhamento de crianças em situação de vulnerabilidade social. O painel permite autenticar um técnico, filtrar a lista de crianças, inspecionar o detalhe de cada caso e registrar a revisão do acompanhamento.

## Visão geral

O projeto foi organizado em duas partes:

- Backend em Node.js com Express, responsável por autenticação, leitura do seed e regras de consulta.
- Frontend em Next.js com TypeScript, responsável pela interface do painel, proteção de rotas e consumo da API.

O layout foi pensado para uso real em campo: telas responsivas, filtros rápidos, informações agregadas no topo do painel e tratamento explícito para crianças com dados parciais ou ausentes nas áreas de saúde, educação e assistência social.

## Como rodar

### Com Docker

O jeito recomendado de subir o projeto é:

```bash
docker compose up --build
```

Isso sobe:

- Frontend em `http://localhost:3000`
- Backend em `http://localhost:4000`

### Em desenvolvimento local

Se preferir rodar cada parte separadamente:

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Credenciais de teste

- E-mail: `tecnico@prefeitura.rio`
- Senha: `painel@2024`

O login retorna um JWT com o campo `preferred_username` contendo o e-mail do técnico autenticado.

## Funcionalidades entregues

- Login com JWT e proteção de rotas no frontend.
- Redirecionamento automático quando o token expira.
- Dashboard com cards de resumo a partir da API.
- Lista de crianças com filtros por bairro, presença de alertas e status de revisão.
- Paginação na listagem.
- Tela de detalhe da criança com a situação nas três áreas.
- Ação de marcar como revisado com feedback visual.
- Suporte a crianças com dados incompletos, exibindo estados vazios informativos em vez de blocos em branco.

## API

Os endpoints usados pela aplicação são:

- `POST /auth/token` - autentica o técnico e devolve o JWT.
- `GET /auth/validate` - valida o token para proteger o fluxo do frontend.
- `GET /api/children` - lista crianças com suporte a filtros e paginação.
- `GET /api/children/:id` - retorna o detalhe de uma criança.
- `GET /api/children/summary` - retorna os agregados do painel.
- `PATCH /api/children/:id/review` - registra a revisão do caso autenticado.

### Filtros aceitos pela listagem

- `bairro` - aceita um bairro ou uma lista separada por vírgula.
- `revisado` - `true` ou `false`.
- `comAlerta` - `true` ou `false`.
- `pagina` - paginação baseada em número da página.
- `limite` - quantidade de itens por página.

## Decisões arquiteturais

### Backend em Node.js

A base foi implementada em Node.js com Express para manter a entrega simples, rápida de subir e fácil de entender. Como o desafio pede um painel funcional com foco em integração e tratamento de dados, a prioridade foi reduzir complexidade operacional e manter a API previsível.

### Seed em memória

Os 25 registros fictícios do desafio são carregados a partir de `backend/src/data/seed.json` no boot da aplicação e mantidos em memória durante a execução.

O trade-off é que revisões feitas em runtime não sobrevivem a reinicializações do backend.

### Frontend em Next.js App Router

O frontend usa Next.js com App Router e TypeScript, com proteção de rotas via `middleware.ts` e validação periódica do JWT. O token fica salvo em cookie chamado `pf_rio_token`.

### Componentes e estilo

- Tailwind CSS para utilitários de layout e responsividade.
- shadcn/ui para botões, inputs, selects e combobox 

## Autenticação e proteção

- O login chama `POST /auth/token`.
- O JWT é persistido em cookie.
- O frontend consulta `GET /auth/validate` para confirmar se a sessão continua válida.
- O `middleware.ts` bloqueia rotas protegidas quando não há token válido.
- Quando o token expira, o usuário é redirecionado automaticamente para a tela de login.

## Como os dados incompletos são tratados

O seed inclui casos em que a criança tem dados em apenas uma ou duas áreas, ou até nenhuma informação adicional além do cadastro base. Nesses casos, a interface não deixa cartões vazios: ela mostra mensagens explícitas do tipo "sem informações registradas" para cada área ausente.

Isso ajuda o técnico a entender rapidamente o que existe e o que ainda precisa ser apurado.

## O que eu faria com mais tempo

- Persistir as revisões em um banco de dados real.
- Colocaria comentários para o melhor entendimento do código e do fluxo.
- Adicionar testes unitários e E2E.
- Incluir mapa dos alertas por bairro, um choropleth map. Provavelmente utilizaria o plotly o leaflet junto com os dados de limite dos bairros que estão disponíveis no https://www.data.rio/datasets/limite-de-bairros/api
- Evoluir a camada de acessibilidade com navegação por teclado ainda mais refinada.
