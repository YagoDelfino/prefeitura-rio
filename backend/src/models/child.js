class Child {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.data_nascimento = data.data_nascimento;
    this.bairro = data.bairro;
    this.responsavel = data.responsavel;

    this.saude = data.saude || null;
    this.educacao = data.educacao || null;
    this.assistencia_social = data.assistencia_social || null;

    this.revisado = data.revisado || false;
    this.revisado_por = data.revisado_por || null;
    this.revisado_em = data.revisado_em || null;
  }

  hasAlert() {
    return (
      (this.saude?.alertas?.length || 0) > 0 ||
      (this.educacao?.alertas?.length || 0) > 0 ||
      (this.assistencia_social?.alertas?.length || 0) > 0
    );
  }

  getAlertsByArea() {
    return {
      saude: (this.saude?.alertas?.length || 0) > 0,
      educacao: (this.educacao?.alertas?.length || 0) > 0,
      assistencia_social: (this.assistencia_social?.alertas?.length || 0) > 0,
    };
  }

  markAsReviewed(userEmail) {
    this.revisado = true;
    this.revisado_por = userEmail;
    this.revisado_em = new Date().toISOString();
  }
}

module.exports = Child;