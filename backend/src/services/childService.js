const data = require("../data/seed.json");
const Child = require("../models/child");

const children = data.map((childData) => new Child(childData));

function getChildren({ bairro, revisado, comAlerta, pagina, limite }) {
    let resultado = [...children];

    if(bairro){
        resultado = resultado.filter((child) => child.bairro === bairro);
    }

    if(revisado !== undefined){
        resultado = resultado.filter((child) => child.revisado === (revisado === 'true'));
    }

    if(comAlerta !== undefined){
        resultado = resultado.filter((child) => child.hasAlert() === (comAlerta === 'true'));
    }

    if(pagina !== undefined && limite !== undefined){
        const inicio = (pagina - 1) * limite;
        const fim = inicio + limite;
        resultado = resultado.slice(inicio, fim);
    }

    return resultado;
}

function getChildById(id) {
    return children.find((child) => child.id === id);
}

module.exports = { getChildren, getChildById };
