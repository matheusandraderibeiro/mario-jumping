const mario = document.querySelector (".mario");
const tela = document.querySelector (".game-board");
const pontuacao = document.getElementById ("pontuacao");
const canoVerde = document.querySelector (".cano-verde");

const loopVerificacao = setInterval (() => {
    const posicaoDoCano = canoVerde.offsetLeft;
    const meusPontos = pontuacao.textContent;
    const posicaoDoMario = +window.getComputedStyle(mario).bottom.replace("px", " ");

    if (posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario > 136) {
        pontuacao.textContent = parseInt (pontuacao.textContent) + 1;
    }

    if(posicaoDoCano <= 114 && posicaoDoCano > 0 && posicaoDoMario < 136) {
        canoVerde.style.animation = "none";
        canoVerde.style.left = `${posicaoDoCano}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${posicaoDoMario}px`;
        mario.src = "./src/img/mario_game-over.png";
        mario.style.width = "75px";
        mario.style.marginLeft = "50px";

        setTimeout (()=> {
            tela.innerHTML = `
            <h2 class="titulo_G-O">Game Over</h2>
            <h3 class="mensagem_G-O">Você fez: ${meusPontos} pontos</h3>
            <button id="jogar-novamente" class="btn-jogar_G-O">Restart</button>
            `
            tela.style.background = "#000000";
        },110);

        clearInterval(loopDeVerificacao);
    }
}, 105);

document.addEventListener ("click", () => {
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
});

document.addEventListener ("keydown", () => {
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
}); 

document.body.addEventListener ("click", (event) => {
    if (event.target.id == "jogar-novamente") {
        window.location.reload();
    }
});