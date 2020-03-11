import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import { withRouter } from 'react-router-dom'
import SelectMenu from '../../components/selectMenu'
import LancamentoService from '../../app/service/lancamentoService'

import * as messages from '../../components/toastr'

import LocalStorageService from '../../app/service/localStorageService'

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        tipo: '',
        valor: '',
        status: '',
        usuario: '',
        atualizando: false
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params
        if (params.id) {
            this.service.obterPorId(params.id)
                .then( response => {
                    this.setState( {...response.data, atualizando: true} )
                }).catch ( error => {
                    messages.mensagemErro(error.response.data)
                })
        }
        console.log('params: ', params)
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState( { [name]: value} )
    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const { descricao, ano, mes, tipo, valor } = this.state;
        const lancamento = { descricao, ano, mes, tipo, valor, usuario: usuarioLogado.id }

        try {
            this.service.validar(lancamento)
        } catch(erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach( msg => messages.mensagemErro(msg))
            return false;
        }

        this.service
            .salvar(lancamento)
            .then( response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso')
            }).catch( error => {
                messages.mensagemErro(error.response.data)
            }) 
    }

    atualizar = () => {
        const { descricao, ano, mes, tipo, valor, id, usuario } = this.state;
        const lancamento = { descricao, ano, mes, tipo, valor, id, usuario: usuario.id }
    
        console.log(lancamento)
        this.service
            .salvar(lancamento)
            .then( response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado com sucesso')
            }).catch( error => {
                messages.mensagemErro(error.response.data)
            }) 
    }

    render() {

        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        return (
            <Card title={this.state.atualizando ? 'Atualização de lançamento' : 'Cadastro de lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup label="Descrição: *" htmlFor="inputDesc">
                                <input type="text" 
                                       id="inpuDesc"
                                       className="form-control" 
                                       value={this.state.descricao}
                                       name="descricao"
                                       onChange={this.handleChange}
                                       placeholder="Digite a descrição"/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup label="Ano: *" htmlFor="inputAno">
                            <input type="text" 
                                    className="form-control" 
                                    id="inputAno"
                                    name="ano"
                                    value={this.state.ano}
                                    onChange={this.handleChange}
                                    placeholder="Digite o ano"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup label="Mês: *" htmlFor="inputMes">
                            <SelectMenu id="inputMes"
                                        className="form-control" 
                                        name="mes"
                                        value={this.state.mes}
                                        onChange={this.handleChange}
                                        lista={meses} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup label="Valor: *" htmlFor="inputValor">
                            <input type="text" 
                                    className="form-control" 
                                    id="inputValor"
                                    name="valor"
                                    value={this.state.valor}
                                    onChange={this.handleChange}
                                    placeholder="Digite o valor"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup label="Tipo: *" htmlFor="inputTipo">
                            <SelectMenu id="inputTipo"
                                    className="form-control"
                                    name="tipo"
                                    value={this.state.tipo}
                                    onChange={this.handleChange}
                                    lista={tipos}/>
                        </FormGroup>
                        
                    </div>
                    <div className="col-md-4">
                        <FormGroup label="Status: " htmlFor="inputStatus">
                            <input type="text" 
                                    name="status"
                                    value={this.state.status}
                                    className="form-control" 
                                    disabled/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        { this.state.atualizando ? 
                            (
                                <button type="button" className="btn btn-primary" onClick={this.atualizar}>
                                    <i className="pi pi-refresh"></i> Atualizar
                                </button>
                            ) : (
                                <button type="button" className="btn btn-success" onClick={this.submit}>
                                    <i className="pi pi-save"></i> Salvar
                                </button>
                            )
                        }
                        
                        
                        <button type="button" className="btn btn-danger" onClick={ e => this.props.history.push('/consulta-lancamentos')}>
                            <i className="pi pi-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter( CadastroLancamentos )