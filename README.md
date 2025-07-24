# Keka's - Jogo Verdade ou Desafio Online

![Banner do Keka's](./assets/keka's-logo.png)

Bem-vindo ao Keka's! Criei este jogo de Verdade ou Desafio para ser uma experiência online divertida e interativa para jogar com os amigos. É bem simples: crie uma sala, convide a galera com o código, e deixe a garrafa decidir quem será o próximo a revelar um segredo ou a cumprir um desafio!

**[Clique aqui para jogar a versão ao vivo!](https://kekas.vercel.app)**

---

### 💡 Sobre o Projeto: A Jornada por Trás do Código

Este projeto nasceu de um desafio muito pessoal. Depois de ficar um ano inteiro sem programar por causa do falecimento do meu pai, eu precisava saber se ainda "levava jeito" para a coisa. Tinha muitas dúvidas na cabeça se conseguiria mesmo levar um projeto do zero até o deploy, sozinho. E no fim, felizmente, deu tudo certo.

A ideia de fazer um jogo, e não um projeto de portfólio mais "padrão", foi de propósito. Eu queria criar algo que não só mostrasse o que eu sei fazer, mas que fosse divertido para qualquer pessoa testar. Para nós, devs, é normal olhar um projeto com um olhar técnico, mas para os meus amigos e outros usuários, um jogo é muito mais animado de avaliar.

Sei que ainda tenho muito a evoluir, até por ter ficado tanto tempo parado, mas no geral, me sinto muito feliz e realizado com o resultado "final" do Keka's.

---

## 🚀 Funcionalidades

* **Salas Multiplayer:** Crie salas privadas e compartilhe o código de 4 dígitos para que seus amigos possam entrar.
* **Interação em Tempo Real:** Todas as ações, desde girar a garrafa até as votações, são sincronizadas em tempo real para todos os jogadores usando WebSockets.
* **Sistema de Jogo Dinâmico:** A lógica do jogo gerencia turnos, sorteia jogadores, apresenta cartas de verdade ou desafio e controla o fluxo de cada rodada.
* **Votação e Veredito:** Após um desafio ser cumprido, os outros jogadores podem votar se a performance foi boa ou não, e o "questioner" dá o veredito final.
* **Mecanismo de Suspensão:** Vereditos negativos podem resultar em suspensões temporárias para os jogadores, adicionando uma camada extra de estratégia.
* **Regra "Anti-Fuga":** Para manter o jogo justo, um jogador não pode escolher "Verdade" mais de duas vezes seguidas. Na terceira vez, a escolha será automaticamente "Desafio"!

---

## 🛠️ Tecnologias Utilizadas

Este projeto é um **monorepo full-stack** utilizando uma arquitetura moderna para separar as responsabilidades entre o cliente (frontend), o servidor (backend) e a infraestrutura.

#### **Linguagem Principal**
* **TypeScript:** Utilizado em todo o projeto para adicionar tipagem estática, garantindo um código mais seguro e manutenível.

#### **Frontend (Interface do Usuário)**
* **Framework:** React com Vite
* **Estilização:** Tailwind CSS
* **Comunicação em Tempo Real:** Socket.IO Client

#### **Backend (API)**
* **Framework:** Node.js com Express
* **Comunicação em Tempo Real:** Socket.IO
* **Banco de Dados:** PostgreSQL
* **ORM:** Sequelize

#### **Desenvolvimento & Deploy (DevOps)**
* **Ambiente Local:** Docker e Docker Compose
* **Hospedagem:** Frontend na Vercel, Backend e Banco de Dados no Render.
* **CI/CD:** Deploy contínuo configurado a partir de pushes na branch `main` do GitHub.

---

## ⚙️ Como Executar o Projeto Localmente

Para rodar este projeto no seu ambiente local, você precisará ter o **Docker** e o **Docker Compose** instalados.

1.  **Clone o repositório:**

    Você pode clonar o projeto usando HTTPS (mais comum) ou SSH (se você tiver uma chave SSH configurada no seu GitHub).

    * **Com HTTPS:**
        ```bash
        git clone https://github.com/argemiroanjos/truth-or-dare_project.git
        cd truth-or-dare_project
        ```

    * **Com SSH:**
        ```bash
        git clone git@github.com:argemiroanjos/truth-or-dare_project.git
        cd truth-or-dare_project
        ```

2.  **Crie o arquivo de ambiente para a API:**
    * Navegue até a pasta da API: `cd packages/api`
    * Crie um arquivo chamado `.env` com o seguinte conteúdo:
        ```env
        DATABASE_URL="postgresql://root:root@db:5432/spicy_db"
        PORT=3000
        CORS_ORIGIN="http://localhost:5173"
        ```
    * Volte para a pasta raiz: `cd ../..`

3.  **Inicie os contêineres:**
    A partir da raiz do projeto, execute o comando abaixo. Ele irá construir as imagens, iniciar todos os serviços e preparar o banco de dados automaticamente (rodando migrations e seeds).
    ```bash
    docker-compose up --build
    ```

4.  **Acesse a aplicação:**
    * Frontend estará disponível em: [**http://localhost:5173**](http://localhost:5173)

---

## 👨‍💻 Autor

* **Argemiro dos Anjos**
* **GitHub:** [@argemiroanjos](https://github.com/argemiroanjos)
* **LinkedIn:** [Argemiro dos Anjos](https://www.linkedin.com/in/argemiro-dos-anjos)
