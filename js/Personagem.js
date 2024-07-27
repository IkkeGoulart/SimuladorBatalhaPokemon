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
            case 'Causar condicao':
                if ((Math.random() * 101) < ataque.efeito.chance) {
                    alvo.condicao.push(ataque.efeito.condicao.nome);
                }
                break;

            case 'Modificar atributo':
                ataque.efeito.atributo.forEach(atributo => {
                    if (ataque.efeito.alvo === 'oponente') {
                        alvo.atributo *= ataque.efeito.valor;
                    } else {
                        this.atributo *= ataque.efeito.valor;
                    }
                });
                
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

let condicoes = {
    unicas: {
        envenenado: {
            nome: 'envenenado'
        },

        paralisado: {
            nome: 'paralisado'
        },

        queimado: {
            nome: 'queimado'
        },

        congelado: {
            nome: 'congelado'
        },

        dormindo: {
            nome: 'dormindo'
        },

        //fainted
        caido: {
            nome: 'caido'
        }
    },

    acumulativas: {
        confuso: {
            nome: 'confuso'
        },

        //efeito do taunt
        provocado: {
            nome: 'provocado'
        },

        hesitado: {
            nome: 'hesitado'
        },

        substitute: {
            nome: 'substitute'
        }
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
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao', //pode causar poison
            chance: 30,
            condicao: condicoes.unicas.envenenado,
        }

    },

    'Shadow Ball': {
        nome: 'Shadow Ball',
        poder: 80,
        acuracia: 100,
        pp: 15,
        tipo: tipos['Fantasma'],
        categoria: 'Especial',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributo', //diminuir defEsp do oponente em 1 estágio
            chance: 100,
            atributo: 'defEspecial',
            valor: 0.5,
            alvo: 'oponente'
        }
    },

    'Earthquake': {
        nome: 'Earthquake',
        poder: 100,
        acuracia: 100,
        pp: 10,
        tipo: tipos['Terrestre'],
        categoria: 'Fisico',
        prioridade: 0
    },

    'Iron Head': {
        nome: 'Iron Head',
        poder: 80,
        acuracia: 100,
        pp: 15,
        tipo: tipos['Metal'],
        categoria: 'Fisico',
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao', //pode não atacar
            chance: 30,
            condicao: condicoes.acumulativas.hesitado
        }
    },

    'Swords Dance': {
        nome: 'Swords Dance',
        poder: 0,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Normal'],
        categoria: 'Status',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributo', //aumentar atk próprio em 2 estágios
            atributo: 'atk',
            valor: 2,
            alvo: 'proprio'
        }
    },

    'Rapid Spin': {
        nome: 'Rapid Spin',
        poder: 20,
        acuracia: 100,
        pp: 40,
        tipo: tipos['Normal'],
        categoria: 'Fisico',
        prioridade: 0,
        efeito: {
            tipo: 'Limpar campo' //tira leech seed, spikes e afins
        }
    },

    'Taunt': {
        nome: 'Taunt',
        poder: 0,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Trevas'],
        categoria: 'Status',
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao', //causa taunt
            chance: 100,
            condicao: condicoes.acumulativas.provocado
        }
    },

    'Substitute': {
        nome: 'Substitute',
        poder: 0,
        acuracia: 100,
        pp: 10,
        tipo: tipos['Normal'],
        categoria: 'Status',
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao',
            chance: 100,
            condicao: condicoes.acumulativas.substitute
        }
    },

    'Focus Blast': {
        nome: 'Focus Blast',
        poder: 120,
        acuracia: 70,
        pp: 5,
        tipo: tipos['Lutador'],
        categoria: 'Especial',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributo', //Diminuir defEspecial do oponente em 1 estágio
            atributo: 'defEspecial',
            chance: 10,
            valor: 0.5,
            alvo: 'oponente'
        }
    },

    'Close Combat': {
        nome: 'Close Combat',
        poder: 120,
        acuracia: 100,
        pp: 5,
        tipo: tipos['Lutador'],
        categoria: 'Fisico',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributo', //Diminuir defEspecial e def próprio em 1 estágio cada
            atributo: ['defEspecial', 'def'],
            valor: 0.5,
            alvo: 'proprio'
        }
    },

    'Extreme Speed': {
        nome: 'Extreme Speed',
        poder: 80,
        acuracia: 100,
        pp: 5,
        tipo: tipos['Normal'],
        categoria: 'Fisico',
        prioridade: 2
    },

    'Meteor Mash': {
        nome: 'Meteor Mash',
        poder: 90,
        acuracia: 90,
        pp: 10,
        tipo: tipos['Metal'],
        categoria: 'Fisico',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributos', //Aumentar atk próprio em 1 estágio
            atributo: 'atk',
            chance: 20,
            valor: 1.5,
            alvo: 'proprio'
        }
    },

    'Facade': {
        nome: 'Facade', //poder dobra se estiver com condicao unica; burn não corta o dano
        poder: 70,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Normal'],
        categoria: 'Fisico',
        prioridade: 0,
    },

    'Trailblaze': {
        nome: 'Trailblaze',
        poder: 50,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Planta'],
        categoria: 'Fisico',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributos', //aumenta a velocidade própria em 1 estágio
            atributo: 'velocidade',
            chance: 100,
            valor: 1.5,
            alvo: 'proprio'
        }
    },

    'Nasty Plot': {
        nome: 'Nasty Plot',
        poder: 0,
        acuracia: 100,
        pp: 20,
        tipo: tipos['Trevas'],
        categoria: 'Status',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributos', //aumenta o atkEspecial próprio em 2 estágios
            atributo: 'atkEspecial',
            chance: 100,
            valor: 2,
            alvo: 'proprio'
        }
    },

    'Dark Pulse': {
        nome: 'Dark Pulse',
        poder: 80,
        acuracia: 100,
        pp: 15,
        tipo: tipos['Trevas'],
        categoria: 'Especial',
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao', //Poode dar flinch
            chance: 20,
            condicao: condicoes.acumulativas.hesitado
        }
    },

    'Flash Cannon': {
        nome: 'Flash Cannon',
        poder: 80,
        acuracia: 100,
        pp: 10,
        tipo: tipos['Metal'],
        categoria: 'Especial',
        prioridade: 0,
        efeito: {
            tipo: 'Modificar atributos', //Pode reduzir defEspecial do oponente em 1 estágio
            atributo: 'defEspecial',
            chance: 10,
            valor: 0.5,
            alvo: 'oponente'
        }
    },

    'Thunder Wave': {
        nome: 'Thunder Wave',
        poder: 0,
        acuracia: 90,
        pp: 20,
        tipo: tipos['Eletrico'],
        categoria: 'Status',
        prioridade: 0,
        efeito: {
            tipo: 'Causar condicao',
            chance: 100,
            condicao: condicoes.unicas.paralisado
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
        console.log(personagem1.defEspecial)
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
    [ataques["Close Combat"], ataques["Extreme Speed"], ataques["Meteor Mash"], ataques["Swords Dance"]],
    [tipos["Metal"], tipos["Lutador"]],
    70, 110, 70, 115, 70, 90);

let heracross = new Personagem("Heracross",
    [ataques["Close Combat"], ataques["Facade"], ataques["Swords Dance"], ataques["Trailblaze"]],
    [tipos["Lutador"], tipos["Inseto"]],
    80, 125, 75, 40, 95, 85);

let hydreigon = new Personagem("Hydreigon",
    [ataques["Dark Pulse"], ataques['Flash Cannon'], ataques['Nasty Plot'], ataques['Thunder Wave']],
    [tipos["Dragão"], tipos["Trevas"]],
    92, 105, 90, 125, 90, 98);


//a fazer o resto
//*let rayquaza = new Personagem("Rayquaza",
//     [ataques],
//     [tipos["Dragão"], tipos["Voador"]],
//     105, 150, 90, 150, 90, 95);

// let lugia = new Personagem("Lugia",
//     [ataques],
//     [tipos["Voador"], tipos["Psiquico"]],
//     106, 90, 130, 90, 154, 110);

// let hooh = new Personagem("Ho-oh",
//     [ataques],
//     [tipos["Fogo"], tipos["Voador"]],
//     106, 130, 90, 110, 154, 90);

// let kyurem = new Personagem("Kyurem",
//     [ataques],
//     [tipos["Dragão"], tipos["Gelo"]],
//     125, 130, 90, 130, 90, 95);

// let nihilego = new Personagem("Nihilego",
//     [ataques],
//     [tipos["Pedra"], tipos["Venenoso"]],
//     109, 53, 47, 127, 131, 103);

// //ALIENS//
// let quatroBracos = new Personagem("4 Braços",
//     [ataques],
//     [tipos["Lutador"]],
//     [atributos]);

// let arraiajato = new Personagem("Arraia Jato",
//     [ataques],
//     [tipos["Eletrico"], tipos["Voador"]],
//     [atributos]);

// let ameacaaquatica = new Persongagem("Ameaça Aquática",
//     [ataques],
//     [tipos["Agua"], tipos["Metal"]],
//     [atributos]);

// let chama = new Personagem("Chama",
//     [ataques],
//     [tipos["Fogo"]],
//     [atributos]);

// let crashhopper = new Persongem("Crashhopper",
//     [ataques],
//     [tipos["Inseto"]],
//     [atributos]);

// let friagem = new Personagem("Friagem",
//     [ataques],
//     [tipos["Fantasma"], tipos["Gelo"]]);

// let glutao = new Personagem("Glutão",
//     [ataques],
//     [tipos["Venenoso"], tipos["Normal"]],
//     [atributos]);

// let gravattack = new Personagem("Gravattack",
//     [ataques],
//     [tipos["Psiquico"], tipos["Pedra"]],
//     [atributos]);

// let peskydust = new Personagem("Pesky Dust",
//     [ataques],
//     [tipos["Fada"], tipos["Voador"]],
//     [atributos]);

// let tartagira = new Personagem("Tartagira",
//     [ataques],
//     [tipos["Agua"], tipos["Agua"]],
//     [atributos]); 

batalhaTeste(hydreigon, gengar);