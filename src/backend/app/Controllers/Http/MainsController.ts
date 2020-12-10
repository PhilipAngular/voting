import axios, { Method, ResponseType } from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

type doARequestType = { works: boolean; data: any; };
type votingInformationType = { country: any[]; states: any; };

export default class MainsController {
    // VARIÁVEIS GLOBAIS
    private statesInformations: any[] = [];
    private votingInformations: votingInformationType = {
        country: [],
        states: {}
    };

    // MÉTODOS PUBLICOS EM ORDEM ALFABÉTICA
    /**
     * 
     * @param params 
     */
    public getCities = async (params: any) => {
        const { state }: any = params.params;

        if (this.statesInformations.length == 0) {
            await this.initializeRequiredData();
        }

        const codarea = this.convertStateIntoCodarea(state);

        const urlStateMesh = `https://servicodados.ibge.gov.br/api/v2/malhas/${codarea}?view=browser&resolucao=5&formato=application/vnd.geo+json`;

        const stateMeshInformations = await this.consumeARequestToIBGE('get', urlStateMesh, 'json');

        /* ORGANIZE CITIES VOTING INFORMATIONS INTO 
        stateMeshInformations VARIABLE */
        this.orgCitsVotingInfIntoStMeshInf(stateMeshInformations, String(codarea));

        return {
            stateMeshInformations,
            statesInformations: this.statesInformations,
            votingInformations: this.votingInformations,
        };
    };

    public getStates = async () => {
        // PEGANDO INFORMAÇÕES DA MALHA BRASILEIRA DOS ESTADOS
        const urlBrazilMesh = 'https://servicodados.ibge.gov.br/api/v2/malhas?view=browser&resolucao=2&formato=application/vnd.geo+json';
        const brazilMeshInformations = await this.consumeARequestToIBGE('get', urlBrazilMesh, 'json');

        await this.initializeRequiredData();

        /* LENDO OS VALORES DO ARQUIVO JSON PASSADO NA TAREFA 
        E SETANDO NA VARIÁVEL this.votingInformations */
        const candidatesParties = this.getCandidatesParties();

        /* ORGANIZE STATES VOTING INFORMATIONS INTO 
        brazilMeshInformations VARIABLE */
        this.orgStateVotingInfIntoBrMeshInf(brazilMeshInformations);

        return {
            brazilMeshInformations,
            statesInformations: this.statesInformations,
            votingInformations: this.votingInformations,
            candidatesParties
        };
    }

    // MÉTODOS PRIVADOS EM ORDEM ALFABÉTICA
    private consumeARequestToIBGE = async (method: Method, url: string, responseType: ResponseType): Promise<any> => {
        let ret: any = {};

        const retRequest = await this.doARequest(method, url, responseType);

        if (retRequest.works && !this.isObjectEmpty(retRequest.data)) {
            ret = retRequest.data.data;
            // colocar {retRequest.data.data} dentro de um arquivo na pasta temporária para utilizar de forma mais 
            // rápida no próximo carregamento;
        } else {
            // verificar se existe o arquivo {fileName} temporário e se existir pegar 
            // o conteúdo dele e colocar na variável {ret}
        }

        return ret;
    }

    private convertCodareaIntoInitial = (codarea: string) => {
        for (let i = 0; i < this.statesInformations.length; i++) {
            const stateInformations = this.statesInformations[i];

            /* O IF PRECISA SER ==, POIS O CODAREA VEM DO IBGE COMO string
            ENQUANTO O stateInformations.id VEM DO IBGE COMO number */
            if (stateInformations.id == codarea) {
                return stateInformations.sigla;
            }
        }

        return null;
    };

    private convertStateIntoCodarea = (state: string) => {
        for (let i = 0; i < this.statesInformations.length; i++) {
            const stateInformations = this.statesInformations[i];

            /* O IF PRECISA SER ==, POIS O CODAREA VEM DO IBGE COMO string
            ENQUANTO O stateInformations.id VEM DO IBGE COMO number */
            if (stateInformations.id == state || stateInformations.sigla === state) {
                return stateInformations.id;
            }
        }

        return null;
    };

    private doARequest = async (method: Method, url: string, responseType: ResponseType): Promise<doARequestType> => {
        const ret = {
            works: false,
            data: {}
        };

        try {
            const retRequest = await axios({
                method,
                url,
                responseType
            });

            ret.works = true;
            ret.data = retRequest;
        } catch (erro) {
            ret.works = false;
        }

        return ret;
    }

    private getCandidatesParties = (): string[] => {
        const ret: any[] = [];
        const alreadyPut: any[] = [];

        const statesVotesPerParty: any[] = this.votingInformations.country;

        for (let i1 = 0; i1 < statesVotesPerParty.length; i1++) {
            const stateVotesPerParty = statesVotesPerParty[i1].votesPerParty;

            for (let i2 = 0; i2 < stateVotesPerParty.length; i2++) {
                const party = stateVotesPerParty[i2][0];

                if (!alreadyPut.includes(party)) {
                    alreadyPut.push(party);

                    const candidateParty = {
                        party,
                        candidateParty: stateVotesPerParty[i2][1] + " (" + stateVotesPerParty[i2][0] + ")"
                    };

                    ret.push(candidateParty);
                }
            }
        }

        ret.sort((a, b) => {
            if (a.candidateParty > b.candidateParty) {
                return 1;
            }
            if (a.candidateParty < b.candidateParty) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        return ret;
    }

    private initializeRequiredData = async () => {
        // PEGANDO INFORMAÇÕES DOS ESTADOS BRASILEIROS
        const urlStates = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';
        const statesInformations = await this.consumeARequestToIBGE('get', urlStates, 'json');

        // SETANDO VALOR NA VARIÁVEL this.statesInitials
        this.statesInformations = statesInformations;

        /* LENDO OS VALORES DO ARQUIVO JSON PASSADO NA TAREFA 
        E SETANDO NA VARIÁVEL this.votingInformations */
        this.readVotingInformation();
    }

    private initializeVotingInfVar = () => {
        for (let i = 0; i < this.statesInformations.length; i++) {
            const state = {
                [this.statesInformations[i].sigla]: []
            }

            Object.assign(this.votingInformations.states, state);
        }
    }

    private isABrazilianStateOrCitie = (initial: string, id?: number): boolean => {
        for (let i = 0; i < this.statesInformations.length; i++) {
            if (this.statesInformations[i].sigla === initial || this.statesInformations[i].id === id) {
                return true;
            }

        }
        return false;
    }

    private isObjectEmpty(obj: Object): boolean {
        return Object.keys(obj).length === 0;
    }

    private orgCitsVotingInfIntoStMeshInf = (stateMeshInformations: any, codarea: string) => {
        const stateInitial = this.convertCodareaIntoInitial(codarea);

        const statesMeshInformations = stateMeshInformations.features;
        const stateVotingInformations = this.votingInformations.states[stateInitial];

        for (let i1 = 0; i1 < statesMeshInformations.length; i1++) {
            const cityCodearea = statesMeshInformations[i1].properties.codarea;

            for (let i2 = 0; i2 < stateVotingInformations.length; i2++) {
                const cityVotingInformations = stateVotingInformations[i2];

                if (cityCodearea === cityVotingInformations.cd) {
                    stateMeshInformations.features[i1].properties.name = cityVotingInformations.name
                    stateMeshInformations.features[i1].properties.votesPerParty = cityVotingInformations.votesPerParty
                }
            }
        }
    };

    private orgStateVotingInfIntoBrMeshInf = (brazilMeshInformations: any) => {
        const statesMeshInformations = brazilMeshInformations.features;
        const countryVotingInformations = this.votingInformations.country;

        for (let i1 = 0; i1 < statesMeshInformations.length; i1++) {
            const stateInitial = this.convertCodareaIntoInitial(statesMeshInformations[i1].properties.codarea);

            for (let i2 = 0; i2 < countryVotingInformations.length; i2++) {
                const stateVotingInformations = countryVotingInformations[i2];

                if (stateInitial === countryVotingInformations[i2].initial) {
                    brazilMeshInformations.features[i1].properties.name = stateVotingInformations.name;
                    brazilMeshInformations.features[i1].properties.initial = stateVotingInformations.initial;
                    brazilMeshInformations.features[i1].properties.votesPerParty = stateVotingInformations.votesPerParty;
                }
            }
        }
    };

    private readVotingInformation = async () => {
        this.initializeVotingInfVar();

        const fileInformations = readFileSync(join(__dirname, '../../../resources/resultado-1-turno-presidente-2014.json'));
        const fileInformationsJson = JSON.parse(fileInformations.toString());

        for (let i = 0; i < fileInformationsJson.length; i++) {
            if (fileInformationsJson[i][0] === 'UF' && this.isABrazilianStateOrCitie(fileInformationsJson[i][1])) {
                const state = {
                    initial: fileInformationsJson[i][1],
                    name: fileInformationsJson[i][2],
                    votesPerParty: fileInformationsJson[i].splice(4)
                };

                this.votingInformations.country.push(state);
            } else if (fileInformationsJson[i][2] === 'MU' && this.isABrazilianStateOrCitie(fileInformationsJson[i][5])) {

                const city = {
                    name: fileInformationsJson[i][0],
                    cd: fileInformationsJson[i][1],
                    votesPerParty: fileInformationsJson[i].splice(6)
                };

                this.votingInformations.states[fileInformationsJson[i][5]].push(city);
            }
        }
    }
}
