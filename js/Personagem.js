class Personagem {
    nome;
    ataques;
    tipos;

    vidaMaxima;
    vidaAtual;
    atk;
    def;
    atkEspecial;
    defEspecial;
    velocidade;

    condicao

    constructor(nome, ataques, tipos, vidaMaxima, atk, def, atkEspecial, defEspecial, velocidade) {
        this.nome = nome;
        this.ataques = ataques;
        this.tipos = tipos;

        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.atk = atk;
        this.def = def;
        this.atkEspecial = atkEspecial;
        this.defEspecial = defEspecial;
        this.velocidade = velocidade;

        this.condicao = [];
    }

    //VERIFICA SE O ATAQUE ACERTA//
    esquivar(ataque) {
        //acerto é um número entre 0 e 100 -> floor arredonda garantindo um número inteiro
        let acerto = Math.floor(Math.random() * 101);
        //um ataque apenas ocorre caso o numero sorteado for menor ou igual a acuracia do ataque
        //retorna true ou false
        return ataque.acuracia >= acerto;
    }

    movimento(ataque, alvo) {
        if (this.esquivar(ataque)) {
            let dano = this.calcularDano(ataque, alvo);
            this.causarDano(dano, alvo);
            this.aplicarEfeito(ataque, alvo);
        }
    }

    calcularDano(ataque, alvo) {
        let dano = 0;
        let efetividade = 1;

        if (ataque.categoria === 'Fisico' || ataque.categoria === 'Especial') {

            //VERIFICA SE É FISICO OU ESPCIAL//
            if (ataque.categoria === 'Fisico') {
                dano = (((22 * this.atk) * (ataque.poder / alvo.def) / 50) + 2) * 0.8;
            } else {
                dano = (((22 * this.atkEspecial) * (ataque.poder / alvo.defEspecial) / 50) + 2) * 0.8;
            }

            //VERIFICA SE É EFICAZ
            if (ataque.tipo.efetivo.includes(alvo.tipos[0].nome)) {
                efetividade *= 2;
            }
            if (alvo.tipos[1] && ataque.tipo.efetivo.includes(alvo.tipos[1].nome)) {
                efetividade *= 2;
            }

            //VERIFICA SE É FRACO//
            if (ataque.tipo.fraco.includes(alvo.tipos[0].nome)) {
                efetividade /= 2;
            }
            if (alvo.tipos[1] && ataque.tipo.fraco.includes(alvo.tipos[1].nome)) {
                efetividade /= 2;
            }

            //VERIFICA SE É IMUNE//
            if ((alvo.tipos[0].nome.includes(ataque.tipo.imune)) || alvo.tipos[0].nome.includes(ataque.tipo.imune)) {
                efetividade *= 0;
            }
        }

        return Math.floor(dano * efetividade);
    }

    causarDano(dano, alvo) {
        alvo.vidaAtual -= dano;
        //VERIFICA SE O PERSONAGEM CAIU//
        if (alvo.vidaAtual < 0) {
            alvo.vidaAtual = 0;
            alvo.condicao.push('caido');
        }
    }

    aumentarVida(cura) {
        this.vidaAtual += cura;
        if (this.vidaAtual > this.vidaMaxima) {
            this.vidaAtual = this.vidaMaxima;
        }
    }

    aplicarEfeito(ataque, alvo) {
        if (!ataque.efeito) {
            return;
        }

        switch (ataque.efeito.tipo) {
            case 'Envenenar':
                if ((Math.random() * 101) < ataque.efeito.chance) {
                    alvo.condicao.push(condicoes.unicas.envenenado);
                }
                break;

            case 'Aumentar Ataque':
                this.atk *= ataque.efeito.valor;
                break;

            //taunt
            case 'Hesitar':
                if ((Math.random() * 101) < ataque.efeito.chance) {
                    alvo.condicao.push(condicoes.acumulativas.hesitado);
                }
                break;

            default:
                break;
        }
    }

    listarAtaques() {
        let opcoes = `${this.nome}, escolha seu ataque`;
        this.ataques.forEach((ataque, i) => {
            //o que está ${} será substituido quando for executado
            //\n quebra a linha
            opcoes += `\n${i + 1} - ${ataque.nome}`;
        });

        return opcoes;
    }

    escolherAtaque() {
        let opcoes = this.listarAtaques();

        let escolha;
        //loop para verificar se a escolha é válida
        do {
            escolha = prompt(opcoes);

            console.log(escolha);
            if (escolha < 1 || escolha > this.ataques.length) {
                console.log("Entrou no if")
                alert("Opção inválida. Tente novamente.");
                escolha = null;
            }

        } while (escolha === null);

        let ataqueEscolhido = this.ataques[escolha - 1];
        return ataqueEscolhido;
    }

}

let tipos = {
    Lutador: {
        nome: 'Lutador',
        efetivo: ['Normal', "Metal", 'Gelo', 'Trevas', 'Pedra'],
        fraco: ['Psiquico', 'Voador', , 'Fada'],
        resistente: ['Inseto', 'Pedra', 'Trevas'],
        imune: ['']
    },

    Metal: {
        nome: 'Metal',
        efetivo: ['Gelo', 'Fada', 'Pedra'],
        fraco: ['Fogo', 'Lutador', 'Terrestre'],
        resistente: ['Normal', 'Planta', 'Gelo', 'Voador', 'Psiquico', 'Inseto', 'Pedra', 'Dragao', 'Metal', 'Fada'],
        imune: ['Venenoso']
    },

    Terrestre: {
        nome: 'Terrestre',
        efetivo: ['Fogo', 'Eletrico', 'Venenoso', 'Pedra', 'Metal'],
        fraco: ['Planta', 'Gelo', 'Agua'],
        resistente: ['Venenoso', 'Pedra'],
        imune: ['Eletrico']
    },

    Fantasma: {
        nome: 'Fantasma',
        efetivo: ['Fantasma', 'Psiquico'],
        fraco: ['Fantasma', 'Trevas'],
        resistente: ['Venenoso', 'Inseto'],
        imune: ['Normal', 'Lutador']
    },

    Venenoso: {
        nome: 'Venenoso',
        efetivo: ['Planta', 'Inseto'],
        fraco: ['Terrestre', 'Psiquico'],
        resistente: ['Planta', 'Lutador', 'Inseto', 'Fada', 'Venenoso'],
        imune: ['']
    },

    Normal: {
        nome: 'Normal',
        efetivo: [''],
        fraco: ['Lutador'],
        resistente: [''],
        imune: ['Fantasma']
    },

    Inseto: {
        nome: 'Inseto',
        efetivo: ['Planta', 'Psiquico', 'Trevas'],
        fraco: ['Fogo', 'Pedra', 'Voador'],
        resistente: ['Planta', 'Lutador', 'Terrestre'],
        imune: ['']
    },

    Dragão: {
        nome: 'Dragao',
        efetivo: ['Dragao'],
        fraco: ['Dragao', 'Fada', 'Gelo'],
        resistente: ['Fogo', 'Agua', 'Planta', 'Eletrico'],
        imune: ['']
    },

    Trevas: {
        nome: 'Trevas',
        efetivo: ['Psiquico', 'Fantasma'],
        fraco: ['Lutador', 'Inseto', 'Fada'],
        resistente: ['Fantasma', 'Trevas'],
        imune: ['Psiquico']
    },

    Voador: {
        nome: 'Voador',
        efetivo: ['Planta', 'Lutador', 'Inseto'],
        fraco: ['Eletrico', 'Gelo', 'Pedra'],
        resistente: ['Planta', 'Lutador', 'Inseto'],
        imune: ['Terrestre']
    },

    Psiquico: {
        nome: 'Psiquico',
        efetivo: ['Venenoso', 'Lutador'],
        fraco: ['Inseto', 'Fantasma', 'Trevas'],
        resistente: ['Lutador', 'Psiquico'],
        imune: ['']
    },

    Fogo: {
        nome: 'Fogo',
        efetivo: ['Planta', 'Gelo', 'Inseto', 'Metal'],
        fraco: ['Agua', 'Terrestre', 'Pedra'],
        resistente: ['Fogo', 'Planta', 'Gelo', 'Inseto', 'Metal', 'Fada'],
        imune: ['']
    },

    Pedra: {
        nome: 'Pedra',
        efetivo: ['Fogo', 'Gelo', 'Inseto', 'Voador'],
        fraco: ['Agua', 'Planta', 'Lutador', 'Terrestre', 'Metal'],
        resistente: ['Normal', 'Fogo', 'Venenoso', 'Voador'],
        imune: ['']
    },

    Gelo: {
        nome: 'Gelo',
        efetivo: ['Planta', 'Dragao', 'Voador', 'Terrestre'],
        fraco: ['Fogo', 'Lutador', 'Pedra', 'Metal'],
        resistente: ['Gelo'],
        imune: ['']
    },

    Eletrico: {
        nome: 'Eletrico',
        efetivo: ['Agua', 'Voador'],
        fraco: ['Terrestre'],
        resistente: ['Eletrico', 'Voador', 'Metal'],
        imune: ['']
    },

    Fada: {
        nome: 'Fada',
        efetivo: ['Lutador', 'Dragao', 'Trevas'],
        fraco: ['Venenoso', 'Metal'],
        resistente: ['Lutador', 'Inseto', 'Trevas'],
        imune: ['Dragao']
    },

    Planta: {
        nome: 'Planta',
        efetivo: ['Agua', 'Terrestre', 'Pedra'],
        fraco: ['Fogo', 'Inseto', 'Gelo', 'Voador', 'Venenoso'],
        resistente: ['Agua', 'Planta', 'Eletrico', 'Terrestre'],
        imune: ['']
    },

    Agua: {
        nome: 'Agua',
        efetivo: ['Fogo', 'Terrestre', 'Pedra'],
        fraco: ['Eletrico', 'Planta'],
        resistente: ['Fogo', 'Agua', 'Gelo', 'Metal'],
        imune: ['']
    }
}

let ataques = {
    'Sludge Bomb': {
        nome: 'Sludge Bomb',
        poder: 90,
        acuracia: 100,
        pp: 10,
        tipo: tipos['Venenoso'],
        categoria: 'Especial',
        efeito: {
            tipo: 'Envenenar',
            chance: 30
        }

    },

    'Shadow Ball': {
        nome: 'Shadow Ball',
        poder: 80,
        acuracia: 100,
        pp: 15,
        tipo: tipos['Fantasma'],
        categoria: 'Especial',
        efeito: {
            tipo: 'Diminuir defEspecial',
            chance: 20,
            valor: -1.5
        }
    },

    'Earthquake': {
        nome: 'Earthquake',
        poder: 100,
        acuracia: 100,
        pp: 10,
        tipo: tipos['Terrestre'],
        categoria: 'Fisico'
    },

    'Iron Head': {
        nome: 'Iron Head',
        poder: 80,
        acuracia: 100,
        pp: 15,
        tipo: tipos['Metal'],
        categoria: 'Fisico',
        efeito: {
            tipo: 'Hesitar',
            chance: 30
        }
    },

    'Swords Dance': {
        nome: 'Swords Dance',
        poder: 0,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Normal'],
        categoria: 'Status',
        efeito: {
            tipo: 'Aumentar ataque',
            valor: 2
        }
    },

    'Rapid Spin': {
        nome: 'Rapid Spin',
        poder: 20,
        acuracia: 100,
        pp: 40,
        categoria: 'Fisico',
        efeito: {
            tipo: 'Limpar campo'
        }
    },

    'Taunt': {
        nome: 'Taunt',
        poder: 0,
        acuracia: 100,
        pp: 20,
        categoria: 'Status',
        efeito: {
            tipo: 'Causar condicao',
            chance: 100,
            condicao: condicoes.acumulativas.hesitado
        }
    },

    'Substitute': {
        nome: 'Substitute',
        poder: 0,
        acuracia: 100,
        pp: 10,
        categoria: 'Status',
        efeito: {
            tipo: 'substitute',
            chance: 100,
            condicao: condicoes.acumulativas.substitue
        }
    },

    'Focus Blast': {
        nome: 'Focus Blast',
        poder: 120,
        acuracia: 70,
        pp: 5,
        categoria: 'Especial',
        efeito: {
            tipo: 'Diminuir defEspecial',
            chance: 10,
            valor: -1.5
        }
    }


}

let condicoes = {
    unicas: {
        envenenado: {

        },

        paralisado: {

        },

        queimado: {

        },

        congelado: {

        },

        dormindo: {

        },

        //fainted
        caido: {

        }
    },

    acumulativas: {
        confuso: {

        },

        //efeito do taunt
        provocado: {

        },

        hesitado: {

        },

        substitue: {

        }
    }
}

let ordenarPorVelocidade = (personagens) => {
    return personagens.sort((a, b) => b.velocidade - a.velocidade)
}

let batalhaTeste = (personagem1, personagem2) => {
    console.group(`${personagem1.nome} vs. ${personagem2.nome}`);
    let personagens = [personagem1, personagem2];
    let turno = 1;

    while (!personagem1.condicao.includes('caido') && !personagem2.condicao.includes('caido')) {
        console.group(`===Turno ${turno}===`)
        personagens = ordenarPorVelocidade(personagens);

        let atacante = personagens[0];
        let defensor = personagens[1];


        let ataque1 = atacante.escolherAtaque();
        console.log(`${atacante.nome} usou ` + ataque1.nome);
        atacante.movimento(ataque1, defensor);

        if (!defensor.condicao.includes('caido')) {
            let ataque2 = defensor.escolherAtaque();
            console.log(`${defensor.nome} usou ` + ataque2.nome);
            defensor.movimento(ataque2, atacante);
        }

        console.log(`${personagem1.nome} - Vida Atual: ${personagem1.vidaAtual}/ Vida Máxima: ${personagem1.vidaMaxima}`);
        console.log(`${personagem2.nome} - Vida Atual: ${personagem2.vidaAtual}/ Vida Máxima: ${personagem2.vidaMaxima}`);
        console.groupEnd();
        turno++;
    }

    if (personagem1.vidaAtual <= 0) {
        console.log(`${personagem2.nome} venceu a batalha`);
    } else if (personagem2.vidaAtual <= 0) {
        console.log(`${personagem1.nome} venceu a batalha`);
    }

    console.groupEnd();
}

//POKEMONS//
let excadrill = new Personagem("Excadrill",
    [ataques["Earthquake"], ataques["Iron Head"], ataques["Swords Dance"], ataques["Rapid Spin"]],
    [tipos["Metal"], tipos["Terrestre"]],
    110, 135, 60, 50, 65, 88);

let gengar = new Personagem("Gengar",
    [ataques["Shadow Ball"], ataques["Sludge Bomb"], ataques["Substitute"], ataques["Focus Blast"]],
    [tipos["Fantasma"], tipos["Venenoso"]],
    100, 65, 60, 130, 75, 110);

let lucario = new Personagem("Lucario",
    [ataques],
    [tipos["Metal"], tipos["Lutador"]],
    70, 110, 70, 115, 70, 90);

let heracroos = new Personagem("Heracross",
    [ataques],
    [tipos["Lutador"], tipos["Inseto"]],
    80, 125, 75, 40, 95, 85);

let hydreigon = new Personagem("Hydreigon",
    [ataques],
    [tipos["Dragão"], tipos["Trevas"]],
    92, 105, 90, 125, 90, 98);

let rayquaza = new Personagem("Rayquaza",
    [ataques],
    [tipos["Dragão"], tipos["Voador"]],
    105, 150, 90, 150, 90, 95);

let lugia = new Personagem("Lugia",
    [ataques],
    [tipos["Voador"], tipos["Psiquico"]],
    106, 90, 130, 90, 154, 110);

let hooh = new Personagem("Ho-oh",
    [ataques],
    [tipos["Fogo"], tipos["Voador"]],
    106, 130, 90, 110, 154, 90);

let kyurem = new Personagem("Kyurem",
    [ataques],
    [tipos["Dragão"], tipos["Gelo"]],
    125, 130, 90, 130, 90, 95);

let nihilego = new Personagem("Nihilego",
    [ataques],
    [tipos["Pedra"], tipos["Venenoso"]],
    109, 53, 47, 127, 131, 103);

//ALIENS//

batalhaTeste(excadrill, gengar);