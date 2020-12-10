async function getBrazilMeshInformations() {
    // eslint-disable-next-line no-undef
    const { urlBrazilMesh } = CONSTS;

    try {
        return await d3.json(urlBrazilMesh);
    } catch (erro) {
        // eslint-disable-next-line no-console
        console.error(erro);
        return;
    }
}

async function getStateMeshInformations(codarea) {
    try {
        const urlStateMesh = `http://127.0.0.1:3333/api/eleicao/2014/presidente/primeiro-turno/estados/${codarea}/municipios`;
        return await d3.json(urlStateMesh);
    } catch (erro) {
        // eslint-disable-next-line no-console
        console.error(erro);
        return;
    }
}

// eslint-disable-next-line no-unused-vars
const SERVICES = {
    getBrazilMeshInformations,
    getStateMeshInformations
};
