const data = require("../data/seed.json");
const Child = require("../models/child");

const children = data.map((childData) => new Child(childData));

function getChildren({ bairro, revisado, comAlerta, pagina, limite }) {
    let resultado = [...children];

    if(bairro){
        const bairros = Array.isArray(bairro)
            ? bairro
            : String(bairro)
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

        resultado = resultado.filter((child) => bairros.includes(child.bairro));
    }

    if(revisado !== undefined){
        resultado = resultado.filter((child) => child.revisado === (revisado === 'true'));
    }

    if(comAlerta !== undefined){
        resultado = resultado.filter((child) => child.hasAlert() === (comAlerta === 'true'));
    }

    if(pagina !== undefined && limite !== undefined){
        const paginaNumero = Number(pagina);
        const limiteNumero = Number(limite);

        if(!Number.isNaN(paginaNumero) && !Number.isNaN(limiteNumero) && paginaNumero > 0 && limiteNumero > 0) {
            const inicio = (paginaNumero - 1) * limiteNumero;
            const fim = inicio + limiteNumero;
            resultado = resultado.slice(inicio, fim);
        }
    }

    return resultado;
}

function getChildById(id) {
    return children.find((child) => child.id === id);
}

function reviewChild(child, revisado) {
    if(child) {
        child.revisado = revisado;
    }
}

function getChildrenSummary() {
    const summary = {
        total: 0,
        revisado: 0,
        alertas: {
            saude: 0,
            educacao: 0,
            assistencia_social: 0,
        },
        criancasComAlertas: 0,
    };

    children.forEach((child) => {
        summary.total++;

        if(child.hasAlert()) {
            summary.criancasComAlertas++;
        }

        const alertsByArea = child.getAlertsByArea();
        summary.alertas.saude += alertsByArea.saude || 0;
        summary.alertas.educacao += alertsByArea.educacao || 0;
        summary.alertas.assistencia_social += alertsByArea.assistencia_social || 0;

        if(child.revisado) {
            summary.revisado++;
        }
        
    });

    return summary;
}

module.exports = { getChildren, getChildById, reviewChild, getChildrenSummary };
