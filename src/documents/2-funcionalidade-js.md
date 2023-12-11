# Funcionalidade
Primeiro precisamos ter em mente qual é o real objetivo do jogo:

- Pular quando vier um obstaculo;
- Somar um ponto toda vez que o cano foi pulado;
- Ao perder o jogo, deve aparecer uma tela de GAME OVER.

<br>

## O pulo do Mario
Então o primeiro objetivo é fazer o Mario pular. Aqui usaremos dois metodos, quando uma tecla for precionada e quando o mouse for precionado. Mas antes de adicionar esse evento em si, é preciso entender o funcionamento por trás da ação de pular.

Essa ação de pular, nada mais é do que a adição e remoção de uma ***``class``*** na tag do Mario. Então toda vez que o mouse ou o teclado for precionado essa ***``class``*** será adicionada e logo removida da tag. O pulo em si é feito no ***``css``*** e se trata de uma animação (***``@keyframes``***), onde em cada estagio da animação os pixels do Mario estarão em lugares diferentes.

```html
<img src="src/img/mario-run.png" class="mario">         //normal.

<img src="src/img/mario-run.png" class="mario jump">    //quando foi adicionado o evento.
```

```css
@keyframes jump {
    0% {
        bottom: 37px;
    }
    40% {
        bottom: 190px;
    }
    50% {
        bottom: 190px;
    }
    60% {
        bottom: 190px;
    }
    100% {
        bottom: 37px;
    }
}
```

Com isso em mente, no JavaScript, adicionaremos um ***``addEventListener``*** no ***``document``***, um pra quando o mouse for clicado e outro para quando o teclado for clicado. Dentro dessa fução será adicionada a ***``class``*** ao Mario:

```js
const mario = document.querySelector (".mario");

document.addEventListener ("click", () => {
    mario.classList.add("jump");
});

document.addEventListener ("keydown", () => {
    mario.classList.add("jump");
});

```

Mas é necessário retira-lá logo em seguida, caso contrário o Mario não irá mais pular, pois a ***``class``*** já está nele e a animação já foi concluida. Como isso é algo que tem que ser feito sozinho, usaremos o ***``setTimeout``***, ou seja, queremos que, assim que o Mario pular essa ***``class``*** sejá removida.

```js
const mario = document.querySelector (".mario");

document.addEventListener ("click", () => {
    mario.classList.add("jump");

    setTimeout (() => {
        mario.classList.remove("jump");
    }, 500)
});
...
```
<br>

## Colisão com o obstaculo
Agora que o Mario já é capaz de pular, vamos adicionar colisão ao obstaculo para que, assim que ambos colidirem o jogo acabar, caso o Mario não pule. O primeiro a se fazer é achar o pixel que determinara se houve colisão ou não. Então, no ***``css``***, lá nas propriedades do cano, encerraremos a animação dele e o moveremos manualmente para a esquerda até acharmos o ponto em que ambos se choquem. Deste modo faremos uma verificação, quando o cano chegar a tantos pixels da esquerda, se houve ou não pulo.
> Assim que achar o pixel deixe tudo como estava antes.

No JavaScript, criaremos um loop que verificará a todo instante se perdemos ou não, e por ser uma verificação constante usaremos o ***``setInterval``***. Ele segue os mesmos parametros do ***``setTimeout``***.

```js
const loopVerificacao = setInterval(() => {

}, 105);
```

Para fazermos a verificação, pegaremos o imagem do cano do ***``html``*** e dentro da verificação acessaremos a propiedade do deslocamento esquerdo dessa imagem (***``offsetLeft``***), ou seja, ele calcula altomaticamente a distancia do cano com relação ao pixel 0.

Agora precisamos pegar a posição do Mario. Queremos calcular a sua distancia com relação ao ***``bottom``***, neste caso não da pra fazer do mesmo modo que o cano, pois essa propriedade não existe, então temos que fazer do seguinte modo:
```js
const posicaoDoMario = window.getComputedStyle(mario).bottom;
```
Caso seja impresso o valor no log do navegador, perceberemos que o valor retornado é uma ***``string``***, pois ele é apresentado do seguinte modo: <u>***``0px``***</u> e não queremos isso, precisamos que de fato seja um número. Então logo após a captura do valor adicionaremos o ***``replace``*** e converteremos o "px" para nada, e a frente de todo o código adicionaremos o "+" para que seja convertido em número:
```js
const posicaoDoMario = +window.getComputedStyle(mario).bottom.replace("px", " ");
```
> replace serve para localizar uma sequência de caracteres dentro de uma string e substituli-lo por outra sequência de caracteres.

Usando um ***``if``***, calcularemos se a posição do cano e do Mario.

```js
...
const canoVerde = document.querySelector (".cano-verde");

const loopVerificacao = setInterval(() => {
    const posicaoDoCano = canoVerde.offsetLeft;
    const posicaoDoMario = +window.getComputedStyle(mario).bottom.replace("px", " ");

    if (posicaoDoCano <= 114 && posicaoDoMario < 136) {

    }
}, 105);
...
```

Podemos determinar que, assim que ambos se chocarem a animação do cano irá parar e sua posição passará a ser o ponto de encontro de ambos:
```js
...
const canoVerde = document.querySelector (".cano-verde");

const loopVerificacao = setInterval(() => {
    const posicaoDoCano = canoVerde.offsetLeft;
    const posicaoDoMario = +window.getComputedStyle(mario).bottom.replace("px", " ");

    if (posicaoDoCano <= 114 && posicaoDoMario < 136) {
        canoVerde.style.animation = "none";
        canoVerde.style.left = `${posicaoDoCano}px`;
    }
}, 105);
...
```

Porem, independente se o Mario passou ou não, o cano irá parar, então precisamos adicionar umo novo fator a ser considerado no ***``if``***. Se o deslocamento do cano for menor do que zero é sinal que ele já passou do Mario, então essa condição será adicionada ao ***``if``***.

```js
if (posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario < 136) {
    canoVerde.style.animation = "none";
    canoVerde.style.left = `${posicaoDoCano}px`;
}
```

Repetiremos o mesmo processo só que com o Mario, definindo os mesmos status a ele, mas mudaremos sua imagem e ajustaremos sua imagem para se adequar aos novos parametros.

```js
if (posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario < 136) {
    canoVerde.style.animation = "none";
    canoVerde.style.left = `${posicaoDoCano}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${posicaoDoMario}px`;
    mario.src = "./src/img/mario_game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";
}
```

Agora encerraremos o loop, pois mesmo que tudo pare as verificações continuam

```js
if (posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario < 136) {
    canoVerde.style.animation = "none";
    canoVerde.style.left = `${posicaoDoCano}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${posicaoDoMario}px`;
    mario.src = "./src/img/mario_game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";

     clearInterval(loopDeVerificacao);
}
```

<br>

## Pontuação 
Pois bem, agora a mecanica principal está funcionando, mas podemos deixar o jogo ainda melhor. Mexeremos então na pontuação do jogo. O objetivo é simples: toda vez que o Mario pula o cano, o contador conta 1 ponto.

Basicamente o contador para que seja flexivel as mudanças propostas será um ***``span``*** 
```html
<article class="caixa-pontuação">
    <div class="borda-menor">
        <span id="pontuacao">00</span>
    </div>
</article>
```

No Javascript, pegaremos esse valor e adicionaremos ele a verifificação continua, como queremos que ele some, precisamos ter acesso ao seu valor. Iremos armazena-lo em uma const, pois isso será importante mais a frente.

```js
const pontuacao = document.getElementById ("pontuacao");

const loopVerificacao = setInterval (() => {
    const meusPontos = pontuacao.textContent;

...
```
Agora que temos acesso ao seu valor, podemos fazer um ***``if``*** para toda vez que o Mario estiver a cima da altura minima.

```js
const pontuacao = document.getElementById ("pontuacao");

const loopVerificacao = setInterval (() => {
    const meusPontos = pontuacao.textContent;

    if (posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario > 136) {
        pontuacao.textContent = parseInt (pontuacao.textContent) + 1;
    }
...
```

> Repare que para o jogo entender que o player perdeu, a posição do mario tem que ser menor que 136, aqui para prossequir com o jogo a posição do Mario é maior do que 136. 

> Dentro do if, o valor passa de string para numero e é somado.

## Game Over
Por fim a tela de game over. O que acontecerá é, a tela mudará assim que você perder. Vamos usar a mesma lógica do pulo para adicionar e remover classes do jogo.

Então, usando o ***``setTimeout``*** assim que você perder mudaremos algumas propriedades do jogo, então essa mudança tem que está inserida dentro do ***``if``*** ao qual o player perde.

Pense bem, queremos mudar a tela inteira, então pegaremos a tag mais abrangente possivel e nela operaremos as mudanças. 
> como queremos que as bordas permaneçam e todo o conteúdo se encontra dentro delas, a tag ao qual a borda se encotra não será mexida, somente as de dentro.

Então pegaremos a ***``section``*** principal e no Javascript aplicaremos as mudanças nela.

Como queremos adicionar mudanças que alteraram a estrutura ***``html``*** do jogo, precisamos fazer isso através do ***``innerHTML``***, é dentro dele que todas as alterações serão feitas

Adicionaremos novas tags aqui:
- Um titulo de game over;
- Uma legenda dizendo sua pontuação.
> Lembra da variavel em que o valor do contador foi guardado? ela é muito útil aqui.

- Um botão de restart.
    - para esse botão mais a baixo falaremos de sua fução.

- Mudamos o estilo da tela para a cor preta.

```JS
setTimeout (()=> {
    tela.innerHTML = `
    <h2 class="titulo_G-O">Game Over</h2>
    <h3 class="mensagem_G-O">Você fez: ${meusPontos} pontos</h3>
    <button id="jogar-novamente" class="btn-jogar_G-O">Restart</button>
    `
    tela.style.background = "#000000";
},110);
```

O botão tem a função de reiniciar a pagina, então no corpo da pagina será adicionado um ouvinte ao qual escutara um "click", então assim que o target com o id do botao for acionado, a pagina resetará.

```js
document.body.addEventListener ("click", (event) => {
    if (event.target.id == "jogar-novamente") {
        window.location.reload();
    }
});

```