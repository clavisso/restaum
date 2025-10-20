# Jogo Resta Um - CI/CD com Docker

Projeto demonstrativo de pipeline CI/CD utilizando GitHub Actions, Docker e Node.js com interface web completa.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

## Jogar no Navegador

```bash
docker compose up app
```

Acesse: http://localhost:3000

## Execução Local

```bash
# Testes
docker compose up test

# Cobertura
docker compose up coverage

# Lint
docker compose up lint

# Build
docker compose build
```

## Documentação

- README.md - Este arquivo (visão geral)
- MANUAL.md - Manual completo com todos os comandos e conceitos

## Estrutura

```
resta-um-game/
├── public/              # Interface web
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── game.js
├── server.js            # Servidor HTTP
├── game.js              # Lógica do jogo
├── game.test.js         # Testes
└── ... arquivos Docker/CI
```

## Pipeline CI/CD

Acionado em push para main/develop e em pull requests.

Etapas:
1. Test - Lint e testes unitários
2. Build - Construção da imagem Docker
3. Deploy - Deploy em produção (apenas main)
4. Notify - Status consolidado

## Licença

MIT
