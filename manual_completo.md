# Manual - Jogo Resta Um com CI/CD

Manual simplificado focado em execução do projeto e conceitos de CI/CD.

## Índice

1. [Execução Rápida](#execução-rápida)
2. [Comandos Principais](#comandos-principais)
3. [CI/CD Explicado](#cicd-explicado)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Problemas Comuns](#problemas-comuns)

---

## Execução Rápida

### Primeira vez (setup inicial)

```bash
# 1. Criar estrutura (executar setup.ps1)
.\setup.ps1

# 2. Entrar na pasta
cd resta-um-game

# 3. Construir imagens Docker
docker compose build

# 4. Executar testes
docker compose up test
```

### Jogar no navegador

```bash
# Iniciar servidor
docker compose up app

# Acessar
http://localhost:3000
```

### Desenvolvimento

```bash
# Testes
docker compose up test

# Cobertura
docker compose up coverage

# Análise de código
docker compose up lint

# Parar tudo
docker compose down
```

---

## Comandos Principais

### docker compose build

**O que faz:** Cria as imagens Docker do projeto

**Quando usar:**
- Primeira vez que roda o projeto
- Depois de alterar o Dockerfile
- Depois de alterar package.json

```bash
docker compose build              # Build normal
docker compose build --no-cache   # Build do zero (sem cache)
```

### docker compose up

**O que faz:** Inicia containers e executa comandos

**Variações:**

```bash
# Servidor web (jogar no navegador)
docker compose up app

# Executar testes
docker compose up test

# Relatório de cobertura
docker compose up coverage

# Análise de código (lint)
docker compose up lint

# Modo background (não trava terminal)
docker compose up -d app
```

### docker compose down

**O que faz:** Para e remove containers

```bash
docker compose down           # Para containers
docker compose down -v        # Para e remove volumes
```

### docker compose logs

**O que faz:** Mostra logs dos containers

```bash
docker compose logs app       # Ver logs
docker compose logs -f app    # Ver logs em tempo real
```

---

## CI/CD Explicado

### O que é CI/CD?

**CI (Continuous Integration)**
- Código é integrado frequentemente
- Testes automáticos em cada mudança
- Detecta problemas rapidamente

**CD (Continuous Deployment)**
- Deploy automático após testes passarem
- Código vai direto para produção
- Processo padronizado e confiável

### Pipeline deste Projeto

O arquivo `.github/workflows/ci.yml` define o pipeline:

```
┌──────────────┐
│ Developer    │
│ faz commit   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│ GitHub Actions detecta push      │
└──────┬───────────────────────────┘
       │
       ├─────────────┬──────────────┐
       ▼             ▼              │
┌──────────┐  ┌──────────┐         │
│   TEST   │  │  BUILD   │         │
├──────────┤  ├──────────┤         │
│ - Lint   │  │ - Docker │         │
│ - Tests  │  │ - Image  │         │
│ - Cover  │  │ - Push   │         │
└────┬─────┘  └────┬─────┘         │
     │             │                │
     └──────┬──────┘                │
            ▼                       │
     ┌──────────┐                   │
     │  DEPLOY  │◄──────────────────┘
     │ (main)   │
     └────┬─────┘
          ▼
     ┌──────────┐
     │  NOTIFY  │
     └──────────┘
```

### Jobs do Pipeline

#### 1. Job: test

**O que faz:**
- Constrói imagem de desenvolvimento
- Executa ESLint (análise de código)
- Roda todos os testes
- Gera relatório de cobertura

**Por que importa:**
Garante que código está funcionando antes de fazer deploy

#### 2. Job: build

**O que faz:**
- Constrói imagem de produção
- Faz push para GitHub Container Registry
- Cria tags automáticas

**Por que importa:**
Prepara aplicação para deploy em produção

#### 3. Job: deploy

**O que faz:**
- Executa APENAS na branch main
- Baixa imagem mais recente
- Faz deploy (simulado neste projeto)

**Por que importa:**
Automatiza processo de colocação em produção

#### 4. Job: notify

**O que faz:**
- Consolida resultado de todos os jobs
- Registra sucesso ou falha

**Por que importa:**
Feedback rápido sobre o que aconteceu

### Quando o Pipeline Executa

**Em push para main ou develop:**
```bash
git push origin main
# Pipeline executa automaticamente
```

**Em Pull Request para main:**
```bash
git push origin feature/nova-funcionalidade
# Criar PR no GitHub
# Pipeline executa automaticamente
```

### Como Ver o Pipeline Executando

1. Fazer commit e push
2. Ir no GitHub
3. Clicar na aba "Actions"
4. Ver workflow executando em tempo real
5. Clicar para ver logs detalhados

### Exemplo Prático de CI/CD

**Cenário:** Adicionar nova funcionalidade

```bash
# 1. Criar branch
git checkout -b feature/novo-botao

# 2. Fazer alterações no código
# ... editar arquivos ...

# 3. Testar localmente
docker compose up test

# 4. Commit e push
git add .
git commit -m "feat: adiciona novo botão"
git push origin feature/novo-botao

# 5. Criar Pull Request no GitHub
# Pipeline executa automaticamente

# 6. Se testes passarem: merge para main
# Deploy automático acontece
```

---

## Estrutura do Projeto

### Arquivos Principais

```
resta-um-game/
├── public/                    # Interface web
│   ├── index.html            # Página do jogo
│   ├── styles.css            # Estilos
│   ├── app.js                # Interação do usuário
│   └── game.js               # Lógica (browser)
│
├── game.js                   # Lógica do jogo (Node.js)
├── game.test.js              # Testes automatizados
├── server.js                 # Servidor HTTP
│
├── package.json              # Dependências do projeto
├── Dockerfile                # Como criar imagem Docker
├── docker-compose.yml        # Como executar containers
│
└── .github/workflows/
    └── ci.yml                # Pipeline de CI/CD
```

### Dockerfile (Multi-stage)

O Dockerfile tem 3 estágios:

**builder:** Instala dependências de produção
```dockerfile
FROM node:18-alpine AS builder
RUN npm install --production
```

**development:** Para testes e desenvolvimento
```dockerfile
FROM node:18-alpine AS development
RUN npm install
CMD ["npm", "test"]
```

**production:** Imagem final otimizada
```dockerfile
FROM node:18-alpine AS production
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "server.js"]
```

**Vantagem:** Imagem de produção pequena e segura

### docker-compose.yml

Define 4 serviços:

**app:** Servidor web
```yaml
app:
  ports: "3000:3000"
  command: npm start
```

**test:** Executa testes
```yaml
test:
  command: npm test
```

**coverage:** Cobertura de testes
```yaml
coverage:
  command: npm run test:coverage
```

**lint:** Análise de código
```yaml
lint:
  command: npm run lint
```

### ci.yml (GitHub Actions)

Define o pipeline de CI/CD:

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    steps:
      - Checkout código
      - Build imagem dev
      - Run lint
      - Run tests
      - Upload coverage
  
  build:
    needs: test
    steps:
      - Build imagem prod
      - Push para registry
  
  deploy:
    needs: [test, build]
    if: branch == main
    steps:
      - Deploy aplicação
```

---

## Problemas Comuns

### Build falha com erro "npm ci"

**Erro:**
```
npm ci requires package-lock.json
```

**Solução:**
Já corrigido no Dockerfile usando `npm install` ao invés de `npm ci`

### Porta 3000 em uso

**Erro:**
```
Error: Port 3000 is already in use
```

**Solução 1:** Parar o que está usando a porta
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número] /F

# Linux/Mac
lsof -i :3000
kill -9 [PID]
```

**Solução 2:** Mudar porta no docker-compose.yml
```yaml
ports:
  - "3001:3000"
```

### Alterações não aparecem no navegador

**Solução:**
- Fazer hard refresh: Ctrl + F5
- Ou Ctrl + Shift + R
- Ou abrir aba anônima

### Testes falhando

**Solução:**
```bash
# Limpar tudo
docker compose down -v
docker compose build --no-cache
docker compose up test
```

### Permissão negada no Docker (Linux)

**Solução:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Pipeline GitHub Actions não executa

**Verificar:**
1. Arquivo está em `.github/workflows/ci.yml`
2. Sintaxe YAML está correta
3. GitHub Actions está habilitado (Settings > Actions)

---

## Resumo de Comandos

### Setup inicial
```bash
.\setup.ps1                    # Criar projeto
cd resta-um-game               # Entrar na pasta
docker compose build           # Construir imagens
```

### Desenvolvimento
```bash
docker compose up app          # Jogar no navegador (porta 3000)
docker compose up test         # Executar testes
docker compose up coverage     # Ver cobertura
docker compose up lint         # Análise de código
docker compose down            # Parar tudo
```

### Git e CI/CD
```bash
git add .                      # Adicionar arquivos
git commit -m "mensagem"       # Fazer commit
git push origin main           # Enviar para GitHub
# Pipeline executa automaticamente
```

### Visualizar
```bash
docker compose logs app        # Ver logs
docker ps                      # Containers rodando
docker images                  # Imagens disponíveis
```

---

## Conceitos Importantes

### Docker
Empacota aplicação com todas as dependências. Garante que funciona igual em qualquer lugar.

### Container
Instância de uma imagem Docker rodando. Isolado do resto do sistema.

### Docker Compose
Gerencia múltiplos containers. Define como eles trabalham juntos.

### Pipeline
Sequência automatizada de etapas (teste, build, deploy).

### Job
Conjunto de tarefas que rodam juntas no pipeline.

### Artifact
Arquivo gerado durante o pipeline (ex: relatório de cobertura).

---

## Fluxo Completo

### Desenvolvimento Local
```
1. Fazer alteração no código
2. docker compose up test
3. Verificar se passou
4. docker compose up app
5. Testar no navegador
6. git commit e push
```

### Pipeline Automático
```
1. Push detectado pelo GitHub
2. Actions inicia pipeline
3. Testes executam
4. Build da imagem
5. Deploy (se main)
6. Notificação de resultado
```

### Verificação
```
1. Abrir GitHub
2. Aba Actions
3. Ver workflow
4. Verificar logs
5. Badge mostra status
```
