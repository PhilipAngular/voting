// eslint-disable-next-line no-unused-vars
async function initialize() {
    /* eslint-disable no-undef */
    const globalVariables = GLOBAL_VARIABLES;
    const { zoomed, createAndShowBrazil, createOptions } = GLOBAL_FUNCTIONS;
    const { getBrazilMeshInformations } = SERVICES;
    /* eslint-enable no-undef */

    // pegando tamanho da tela para o mapa
    globalVariables.mapScreenPart = document.getElementsByClassName('map')[0];
    globalVariables.heightMap = globalVariables.mapScreenPart.offsetHeight;
    globalVariables.widthMap = globalVariables.mapScreenPart.offsetWidth;

    // variável responsável por controlar o zoom
    globalVariables.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', zoomed);

    // pegar os dados do brasil inteiro (estados)
    const ret = await getBrazilMeshInformations();

    globalVariables.brazilInformations = ret.brazilMeshInformations;
    const candidatesParties = ret.candidatesParties;
    const statesInformations = ret.statesInformations;

    globalVariables.tooltip = d3.select('.tooltip')
        .style('opacity', 0);

    createAndShowBrazil();
    createOptions(candidatesParties, false);
    createOptions(statesInformations, true);

    document.getElementsByClassName('divabsolute')[0].hidden = true;
}

// eslint-disable-next-line no-unused-vars
function checkVotes(isBig) {
    /* eslint-disable no-undef */
    const { paintTheMap, resetCities, resetColorMap } = GLOBAL_FUNCTIONS;
    /* eslint-enable no-undef */

    let party;
    let state;

    if (isBig) {
        party = document.getElementById('partido-g').value;
        state = document.getElementById('estado-g').value;

        document.getElementById('partido-p').value = party;
        document.getElementById('estado-p').value = state;
    } else {
        party = document.getElementById('partido-p').value;
        state = document.getElementById('estado-p').value;

        document.getElementById('partido-g').value = party;
        document.getElementById('estado-g').value = state;
    }

    if (party && state) {
        statesLoop(state, false, party);
    } else if (party && !state) {
        resetCities();
        paintTheMap(party, '#states');
    } else if (!party && state) {
        statesLoop(state, true, party);
    } else if (!party && !state) {
        resetCities();
        resetColorMap('#states');
    }


}

/**
 * @function statesLoop
 * @description usado para encapsular um bloco de código 
 * mais complexo que se repetiria. Tendo apenas pequenas
 * diferenças. Serve para fazer um loop em todas as partes
 * do mapa e verificar se a nova requisição para pintar
 * o mapa é no mesmo estado ou não. Caso seja no mesmo
 * estado será: ou resatada para a cor default, ou pintada
 * com a nova cor para o outro partido. Se não, será feito
 * um click no outro estado.
 * @param {*} state 
 * @param {*} isJustState 
 * @param {*} party 
 */
const statesLoop = (state, isJustState, party) => {
    /* eslint-disable no-undef */
    const globalVariables = GLOBAL_VARIABLES;
    const { paintTheMap, resetColorMap, stateClick } = GLOBAL_FUNCTIONS;
    /* eslint-enable no-undef */

    d3.select('#states').selectAll('path').each(async d => {
        if (d.properties.codarea === state) {
            if (globalVariables.lastState && globalVariables.lastState.properties.initial === d.properties.initial) {
                if (isJustState) {
                    resetColorMap('#cities');
                } else {
                    paintTheMap(party, '#cities');
                }
            } else {
                stateClick(d);
            }
        }
    });
};
