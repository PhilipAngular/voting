# VotingApp

Este README tem como objetivo explicar sobre o software desenvolvido e também de como foi o desenvolvimento.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Inicialização do Sistema](#inicialização-do-sistema)
- [Critérios de Avaliação mencionados](#critérios-de-avaliação-mencionados)
  - [Completude](#completude)
  - [Assertividade](#assertividade)
  - [Organização do código](#organização-do-código)
  - [Legibilidade do código](#legibilidade-do-código)
  - [Segurança](#segurança)
  - [Cobertura de testes](#cobertura-de-testes)
  - [Escolhas técnicas](#escolhas-técnicas)
- [Observações Finais](#observações-finais)

## Pré-requisitos

- Instalar Node.js v14.15.1 [(clique aqui para baixar direto)](https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi)

## Inicialização do Sistema

Este tópico abordará sobre como o sistema deve ser inicializado para que funcione do jeito que eu estava testando.

1. Primeiro baixe os fontes, ou deszipe o arquivo que eu enviei junto com este case. Caso você não tenha recebido, favor me enviar um email, no endereço philip.i.t.delling@gmail.com, solicitando os fontes, que enviarei o mais rápido possível para mim;
1. Depois disso ache o arquivo `src\backend\.env.example` e tire a parte `.example`. Isso permitirá que você suba a API, pois tem uma chave que eu criei para testes;
1. Quando finalizer, abra um terminal de sua preferência. No meu caso, eu gosto de utilizar o GitBash. E execute os comandos a seguir:

   ```bash
   # vá para a pasta do projeto
   $ cd /voting #enter
   # instale as pendências do projeto
   $ npm i
   # vá para a pasta relativa à API/backend
   $ cd /src/backend #enter
   # instale as pendências da API/backend
   $ npm i
   # suba a API
   $ node ace serve --watch
   ```

1. Após ter executado os comandos apresentados anteriormente. Aguarde o terminal apresentar uma mensagem parecida com essa:
   ![server](https://user-images.githubusercontent.com/16709062/101722625-61c28280-3a89-11eb-96a3-460ad3c2e6d3.png)
1. Se por acaso um erro como esse aparecer, da imagem a seguir. Significa que você precisa voltar para o segundo passo;
   ![image](https://user-images.githubusercontent.com/16709062/101722744-a8b07800-3a89-11eb-85da-14212f289894.png)
1. O próximo passo é simples. Se o servidor já subiu direitinho, vá até o caminho `..\src\frontend\html\voting.html` e abra esse arquivo no navegador;
1. Agora você pode testar o sistema! 😊

## Critérios de Avaliação mencionados

Neste tópico eu procuro apresentar aquilo que entendi relevante para os critérios de avaliação mencionados.

### Completude

- **Parte do desenvolvedor:** Entendo ter entregue toda a funcionalidade solicitada. Porém eu mudei duas parte da solicitação, com o intuito de entregar uma funcionalidade que parecia ser mais interessante ao usuário final. No caso, se fosse um exemplo real trabalhando na empresa primeiramente eu teria perguntado ao meu analista, gerente ou até mesmo ao usuário se seria do interesse dele. As partes que eu modifiquei foram:
  1. **`Ao mudar o partido, o mapa deveria focar no Brasil e colorir os estados e o combobox de estados deve ser resetado`** - Nesta alteração eu fiz com que ao mudar de partido, permanecesse no estado, porém, alterando as cores da cidade, e se caso o cliente quiser sair do estado, basta clicar que ele sairá;
  2. **`Ao selecionar um partido` ... `Ao selecionar um estado`** - Já nesta alteração, eu achei mais interessante colocar um botão de pesquiser. Mesmo entendendo um pouco de `Usabilidade` e sabendo que há um clique a mais ali, compreendo ser mais comum aos usuários o botão. Sendo necessário assim, menos tempo de costume do usuário.
- Mas novamente, essas duas opções, foram de minha opinião. Em um exemplo real, eu teria perguntado para ter certeza, antes de ir com tudo.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Assertividade 

- **Parte do desenvolvedor:** Entendo ter entregue todas as funcionalidades solicitadas, mas com certeza tem muitas coisas para melhorar. E pensando nisso que coloco aqui uma possível lista de melhoria:
  1. Permitir ao usuário fazer zoom com o scroll do mouse;
  1. Permitir ao usuário utilizar do drag-and-drop;
  1. Melhorar o visual, provavelmente utilizando a teoriadas cores e um pouco mais de UX;
  1. Fazer com que o mapa seja responsivo em tempo de execução e não apenas estático;
  1. Desenvolver o frontend utilizando de algum framework. Como angular ou react por exemplo;
  1. Aplicar uma forma do front subir de forma autonoma, sem que tenhamos que ir lá abrir o HTML;
  1. Preparar o sistema para ser mais seguro, como minificar o código e não permitir mudanças via console;
  1. Pensar e desenvolver uma forma de salvar algumas variáveis na sessão;
  1. Utilizar de APIs REST;
  1. Armazenar alguns caches para deixar as próximas consultas mais rápidas;
  1. ...
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Organização do código

- **Parte do desenvolvedor:** Pelo fato de eu não ter usado um framework no front, isso acabou sendo um pouco prejudicial na organização. Até iria tentar fazer em REACT. Porém demorei muito tempo tentando entender como funcionava o `d3.js` e passei muito tempo constuindo a tela. No entanto, acredito ter organizado de uma forma bem fácil de entender.
- Já no backend utilizei o AdonisJS v5, que acabou sendo uma mão na roda, pois ele tem uma restrutura de pastas bem definidas, e com os seus comandos próprios, ele acaba sendo uma ótima ferramenta para tentar fazer um desenvolvimento mais rápido e estruturado.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Legibilidade do código

- **Parte do desenvolvedor:** Busco utilizar o clean code, SOLID e comentários sempre que possível (se o tempo de entrega e a tecnologia utilizada permitirem). Não foi possível por em prática todos esses conceitos, infelizmente. Porém, fiz o melhor que pude. E entendo ser muito possível compreender o que está sendo feito no código fonte.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Segurança

- **Parte do desenvolvedor:** Infelizmente neste critério de avaliação eu acabei não conseguindo pensar em muitas coisa além das já comentadas nos itens de melhoria. Assim sendo, acredito que tenha muitas falhas que eu não percebi.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Cobertura de testes

- **Parte do desenvolvedor:** Este foi outro critério que eu não consegui pensar mais do que os itens listados nas melhorias.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

### Escolhas técnicas

- **Parte do desenvolvedor:** A escolha da tecnologia acho que foi a certa. Apliquei os conhecimentos que eu melhor tinha em desenvolvimento puro. Pois faz muito tempo que eu trabalho com frameworks. Então assim eu puder entender melhor em que patamar eu estou. E compreendo que vocês poderão me avaliar melhor desta forma também. Para o front eu utilizei a combinação convencional de HTML, JS e CSS. E no back utilizei o TS com ajuda do AdonisJS v5. Não escolhi nenhuma forma de armazenamento de dados. Mas como eu havia comentado nos itens de melhoria, este é uma das minhas vontades.
- **Parte do avaliador:**
  |Avaliação|Observações|
  |---------|----|
  |[ ] Cumpriu com toda a avaliação||
  |[ ] Meio a Meio||
  |[ ] Não fez nada esperado||

## Observações Finais

Agradeço muito pela oportunidade que vocês me deram. Realmente achei que seria um case mais simples e fácil. Porém eu me surprendi com a dificuldade que se apresentou para mim. No entanto, eu fiquei extremamente contente de ter conseguido desenvolver o sistema e de apresentar aquilo de melhor que eu pude fazer durante essa uma semana de desenvolvimento.

Atenciosamente, Philip Ibbotson T. Delling
