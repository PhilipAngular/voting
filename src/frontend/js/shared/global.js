/**
 * @function calculateBrazilSizes
 * @description usado para calcular a posição
 * no mapa para o brasil.
 * @return retorna a projeção do mapa configurado
 * para o Brasil
 */
const calculateBrazilSizes = () => {
    // eslint-disable-next-line no-undef
    const { scaleWorld } = CONSTS;
    const { path, brazilInformations, widthMap, heightMap } = GLOBAL_VARIABLES;
    const globalVariables = GLOBAL_VARIABLES;

    const bounds = path.bounds(brazilInformations);
    const hscale = scaleWorld * widthMap / (bounds[1][0] - bounds[0][0]);
    const vscale = scaleWorld * heightMap / (bounds[1][1] - bounds[0][1]);

    const scale = ((hscale < vscale) ? hscale : vscale) * 0.99;
    const x = widthMap - (bounds[0][0] + bounds[1][0]) / 2;
    const y = heightMap - (bounds[0][1] + bounds[1][1]) / 2;
    const offset = [x, y];

    globalVariables.projection = d3.geoMercator()
        .center([-54, -15])
        .scale(scale)
        .translate(offset);

    return path.projection(globalVariables.projection);
};

/**
 * @function calculateStateClickedSizes
 * @description usado para calcular a posição
 * no mapa para o estado específico.
 * @param {d3} stateClicked aqui é recebido as
 * informações que o d3 oferece para cada estado
 * @return retorna um objeto com a `scale` e o
 * `offset` necessário para posicionar o estado
 * no meio do mapa.
 */
const calculateStateClickedSizes = (stateClicked) => {
    const { path, widthMap, heightMap } = GLOBAL_VARIABLES;

    const bounds = path.bounds(stateClicked);

    const hscale = bounds[1][0] - bounds[0][0];
    const vscale = bounds[1][1] - bounds[0][1];
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(hscale / widthMap, vscale / heightMap)));

    const hoffset = (bounds[0][0] + bounds[1][0]) / 2;
    const voffset = (bounds[0][1] + bounds[1][1]) / 2;
    const offset = [widthMap / 2 - scale * hoffset, heightMap / 2 - scale * voffset];

    return {
        scale,
        offset
    };
};

/**
 * @function createAndShowBrazil
 * @description usado para montar o mapa do brasil 
 * na tela
 */
const createAndShowBrazil = () => {
    const { widthMap, heightMap, brazilInformations } = GLOBAL_VARIABLES;
    const globalVariables = GLOBAL_VARIABLES;

    globalVariables.path = initializeMap();

    globalVariables.path = calculateBrazilSizes();

    /* criando e inicializando a imagem do
    do mapa que será gerado */
    globalVariables.svg = d3.select('.map')
        .append('svg')
        .attr('width', widthMap)
        .attr('height', heightMap);

    /* criando e inicializando a parte do
    mapa que ficará "em branco" */
    globalVariables.svg.append('rect')
        .attr('class', 'fundo')
        .attr('width', widthMap)
        .attr('height', heightMap)
        .on('click', resetCities)
        .on('mouseover', () => {
            hideTooltips();
        });

    globalVariables.g = globalVariables.svg.append('g');

    /* criando os estados */
    globalVariables.g.append('g')
        .attr('id', 'states')
        .selectAll('path')
        .data(brazilInformations.features)
        .enter()
        .append('path')
        .attr('id', d => {
            return d.properties.codarea;
        })
        .attr('d', globalVariables.path)
        .attr('class', 'state')
        .attr('vote', 0)
        .on('mouseover', function (d) {
            d3.select(this)
                .style('stroke', 'red')
                .style('stroke-width', '1.5px')
                .raise();

            showTooltips(d, false);
        })
        .on('mouseout', function () {
            d3.select(this)
                .style('stroke', 'black')
                .style('stroke-width', '0.5px');
        })
        .on('click', stateClick);
};

/**
 * @function createAndShowCities
 * @description usado para montar o mapa do estado
 * com as divisões da cidade.
 * @param {d3} stateClicked informação oferecida pelo d3.js
 */
const createAndShowCities = async stateClicked => {
    // eslint-disable-next-line no-undef
    const { getStateMeshInformations } = SERVICES;
    const { g, path } = GLOBAL_VARIABLES;

    g.selectAll(['#cities']).remove();

    const stateInformations = await getStateMeshInformations(stateClicked.properties.codarea);

    g.append('g')
        .attr('id', 'cities')
        .selectAll('path')
        .data(stateInformations.stateMeshInformations.features)
        .enter()
        .append('path')
        .attr('id', d => {
            return d.properties.codarea;
        })
        .attr('d', path)
        .attr('class', 'city')
        .attr('vote', 0)
        .on('mouseover', function (d) {
            d3.select(this)
                .style('stroke', 'red')
                .style('stroke-width', '0.3px')
                .raise();

            showTooltips(d, true);
        })
        .on('mouseout', function () {
            d3.select(this)
                .style('stroke', 'black')
                .style('stroke-width', '0.1px');
        })
        .on('click', resetCities);

    const party = document.getElementById('partido-g').value || document.getElementById('partido-p').value;

    if (party) {
        paintTheMap(party, '#cities');
    }

    document.getElementsByClassName('divabsolute')[0].hidden = true;
};

/**
 * @function createOptions
 * @description usado para criar as opções dos combobox
 * @param {*} informations o arrai que será usado para popular
 * @param {*} isStates true se for para ordenar o combobox de estados
 */
const createOptions = (informations, isStates) => {
    let selectG;
    let selectP;

    if (isStates) {
        sortStateArray(informations);
        selectG = document.getElementById('estado-g');
        selectP = document.getElementById('estado-p');
    } else {
        selectG = document.getElementById('partido-g');
        selectP = document.getElementById('partido-p');
    }

    for (let a = 0; a < informations.length; a++) {
        const optg = document.createElement('option');
        optg.value = isStates ? informations[a].id : informations[a].party;
        optg.innerHTML = isStates ? informations[a].nome : informations[a].candidateParty;
        selectG.appendChild(optg);

        const optp = optg.cloneNode(true);
        selectP.appendChild(optp);
    }
};

/**
 * @function getQntVotes
 * @description usado para pegar a quantidade
 * de votos que um estado ou cidade teve para
 * aquele partido filtrado
 * @param {[][2]} votingInformations informações da votação
 * @param {string} party partido filtrado
 * @return a quantidade de votos.
 */
const getQntVotes = (votingInformations, party) => {
    for (let a = 0; a < votingInformations.length; a++) {
        if (party === votingInformations[a][0]) {
            return votingInformations[a][2];
        }
    }
};

/**
 * @function hideTooltips
 * @description desaparecer com todos os tooltips
 */
const hideTooltips = () => {
    const { tooltip } = GLOBAL_VARIABLES;

    tooltip.transition()
        .duration(200)
        .style('opacity', 0);
};

/**
 * @function initializeMap
 * @description usado para inicializar as variáveis 
 * referentes ao mapa, com os valores gerais do
 * planeta terra.
 * @return retorna a projeção do mapa configurado
 * para o Mapa-múndi
 */
const initializeMap = () => {
    // eslint-disable-next-line no-undef
    const { scaleWorld } = CONSTS;
    const { widthMap, heightMap } = GLOBAL_VARIABLES;
    const globalVariables = GLOBAL_VARIABLES;

    globalVariables.projection = d3.geoMercator()
        .center([-54, -15]) // CENTRO DO BRASIL NO MAPA
        .scale(scaleWorld) // ESCALA DEFAULT DO D3 PARA O MAPA MÚNDI
        .translate([widthMap / 2, heightMap / 2]); // DESLOCAMENTO DO PLANETA NO MAPA

    return d3.geoPath().projection(globalVariables.projection);
};

/**
 * @function paintTheMap
 * @description usado para pintar o mapa de forma
 * monocromática com relação ao partido escolhido
 * no filtro
 * @param {*} party partido escolhido no filtro
 * @param {*} classes pode ser `#states` ou 
 * `#cities`. Depende daquilo que você quer pintar
 */
const paintTheMap = (party, classes) => {
    if (party) {

        const classesDatas = [];

        /* pegar quantidade de votos por partido e por
        parte do mapa que será pintado */
        d3.select(classes).selectAll('path').each(d => {
            const classData = {
                codarea: d.properties.codarea,
                qntVotes: 0
            };

            const votes = d.properties.votesPerParty;
            if (Array.isArray(votes)) {
                for (let i = 0; i < votes.length; i++) {
                    if (votes[i][0] === party) {
                        classData.qntVotes = votes[i][2];
                    }
                }
            }

            classesDatas.push(classData);
        });

        /* ordernar as partes do mapa que será pintado
        para que seja pintado da cor mais fraca à mais
        forte com base na ordenação da variável classesDatas */
        classesDatas.sort((a, b) => {
            if (a.qntVotes > b.qntVotes) {
                return 1;
            }
            if (a.qntVotes < b.qntVotes) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        /* atribuindo um atributo chamado de vote para
        cada parte do mapa, referenciando a posição
        entre a maior e a menor quantidade de votos */
        classesDatas.forEach((item, index) => {
            document.getElementById(item.codarea).setAttribute('vote', index);
        });

        /* pegar a quantidade de partes que tem para
        pintar */
        const qntParts = d3.select(classes).selectAll('path').nodes().length;

        /* criar um método de pintura, a partir do frame
        d3.js. Onde há um range monocromático da cor branca
        ao verde */
        const color = d3.scaleLinear()
            .domain([1, qntParts])
            .range(['white', 'green']);

        // pintando o mapa
        d3.select(classes).selectAll('path').style('fill', d => {
            const paintingOrder = document.getElementById(d.properties.codarea).getAttribute('vote');
            /* adicionando ao d (informação oferecida pelo d3)
            qual é a colocação daquela parte do mapa que está
            sendo pintada. Isso serve para o toltip apresentar
            essa informação quando o usuário passar o mouse no
            mapa */
            d.properties.countingOrder = qntParts - paintingOrder;
            return color(paintingOrder);
        });
    } else {
        resetColorMap(classes);
    }
};

/**
 * @function resetCities
 * @description exclui todas as cidades e o mapa
 * sai do zoom.
 */
const resetCities = () => {
    const { g } = GLOBAL_VARIABLES;
    const globalVariables = GLOBAL_VARIABLES;
    // eslint-disable-next-line no-unused-vars
    globalVariables.lastState = null;

    g.selectAll(['#cities']).remove();

    document.getElementById('estado-g').value = '';
    document.getElementById('estado-p').value = '';

    svgTransition();
};

/**
 * @function resetColorMap
 * @description usado para limpar as cores que
 * estão no mapa, tanto do brasil quanto de um
 * estado específico.
 * @param {*} classes pode ser `#states` ou 
 * `#cities`. Depende daquilo que você quer limpar
 */
const resetColorMap = classes => {
    d3.select(classes)
        .selectAll('path')
        .style('fill', '#8ab395');

    d3.select(classes).selectAll('path').each(d => {
        document.getElementById(d.properties.codarea).setAttribute('vote', 0);
        d.properties.countingOrder = 0;
    });
};

/**
 * @function showTooltips
 * @description usado para apresentar em tela
 * tooltips com dados de cada parte do mapa
 * @param {object} d é os dados oferecidos pelo d3
 * para cada parte do mapa
 * @param {*} isCity se o tooltip que tem que
 * ser apresentado é ou não para uma parte de
 * cidade. Valor default = false. 
 */
const showTooltips = (d, isCity = false) => {
    const { tooltip } = GLOBAL_VARIABLES;

    let html = '';

    if (isCity) {
        html = `<b>Nome da Cidade:</b></br>${d.properties.name}`;
    } else {
        html = `<b>Nome do Estado:</b></br>${d.properties.name}`;
    }

    const party = document.getElementById('partido-g').value || document.getElementById('partido-p').value;

    if (d.properties.votesPerParty && party) {
        html += `</br><b>Quantidade de Votos:</b></br>${getQntVotes(d.properties.votesPerParty, party)}`;
    }

    if (d.properties.countingOrder) {
        html += `</br><b>Ordem da Apuração:</b></br>${d.properties.countingOrder}º`;
    }

    tooltip.transition()
        .duration(200)
        .style('opacity', .9);

    tooltip.html(html)
        .style('left', (d3.event.pageX - 255) + 'px')
        .style('top', (d3.event.pageY - 40) + 'px');
};

/**
 * @function sortStateArray
 * @description usado para ordenar o array de 
 * estados por nome do estado
 * @param {*} statesInformations array de 
 * informações dos estados
 */
const sortStateArray = statesInformations => {
    statesInformations.sort((a, b) => {
        if (a.nome > b.nome) {
            return 1;
        }
        if (a.nome < b.nome) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
};

/**
 * @function stateClick
 * @description usado quando o usuário clica ou confere
 * os votos de um estado específico
 * @param {*} stateClicked informação oferecida pelo d3
 */
const stateClick = stateClicked => {
    const globalVariables = GLOBAL_VARIABLES;

    document.getElementsByClassName('divabsolute')[0].hidden = false;

    // atribuir ap filtro pequeno e grande o estado que foi cliado
    document.getElementById('estado-g').value = stateClicked.properties.codarea;
    document.getElementById('estado-p').value = stateClicked.properties.codarea;

    resetColorMap('#states');

    const { scale, offset } = calculateStateClickedSizes(stateClicked);

    svgTransitionByState(scale, offset);

    if (stateClicked && (!globalVariables.lastState || globalVariables.lastState.properties.initial !== stateClicked.properties.initial)) {
        globalVariables.lastState = stateClicked;

        createAndShowCities(stateClicked);
    }
};

/**
 * @function svgTransition
 * @description usada para startar a transição
 * do zoom para o scale e offset desejado
 */
const svgTransitionByState = (scale, offset) => {
    const { svg, zoom } = GLOBAL_VARIABLES;

    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(offset[0], offset[1]).scale(scale));
};

/**
 * @function svgTransition
 * @description usada para startar a 
 * transição do zoom
 */
const svgTransition = () => {
    const { svg, zoom } = GLOBAL_VARIABLES;

    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
};

/**
 * @function zoomed
 * @description usado para fazer o zoom do mapa
 */
const zoomed = () => {
    GLOBAL_VARIABLES.g.style('stroke-width', 1.5 / d3.event.transform.k + 'px');
    GLOBAL_VARIABLES.g.attr('transform', d3.event.transform);
};

const GLOBAL_VARIABLES = {
    // REFERENTES AO MAPA
    heightMap: undefined,
    mapScreenPart: undefined,
    widthMap: undefined,
    // REFERENTES À IMAGEM SVG
    path: undefined,
    projection: undefined,
    svg: undefined,
    g: undefined,
    // REFERENTES AOS SERVICES
    brazilInformations: undefined,
    // REFERENTE AOS JSs
    lastState: undefined,
    zoom: undefined,
    tooltip: undefined
};

// eslint-disable-next-line no-unused-vars
const GLOBAL_FUNCTIONS = {
    createAndShowBrazil,
    createOptions,
    paintTheMap,
    resetCities,
    resetColorMap,
    stateClick,
    zoomed
};
