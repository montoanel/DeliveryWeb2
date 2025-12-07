import { Cliente, Produto, CaixaMovimento, Pedido, TipoOperacaoCaixa, PedidoStatus, GrupoProduto, FormaPagamento, ConfiguracaoAdicional } from '../types';

export const INITIAL_GROUPS: GrupoProduto[] = [
  { id: 1, nome: 'Lanches' },
  { id: 2, nome: 'Pizzas' },
  { id: 3, nome: 'Bebidas' },
  { id: 4, nome: 'Porções' },
  { id: 5, nome: 'Açaí' },
  { id: 6, nome: 'Adicionais/Complementos' },
];

export const INITIAL_PAYMENT_METHODS: FormaPagamento[] = [
  { id: 1, nome: 'Dinheiro', ativo: true },
  { id: 2, nome: 'Cartão de Crédito', ativo: true },
  { id: 3, nome: 'Cartão de Débito', ativo: true },
  { id: 4, nome: 'PIX', ativo: true },
  { id: 5, nome: 'Voucher / Refeição', ativo: true },
];

// Seed Data
export const INITIAL_PRODUCTS: Produto[] = [
  { id: 1, ativo: true, tipo: 'Principal', codigoInterno: 'L01', codigoBarras: '7890000001', nome: 'X-Burger Especial', preco: 25.00, custo: 12.00, unidadeMedida: 'UN', grupoProdutoId: 1, imagem: 'https://picsum.photos/200/200?random=1' },
  { id: 2, ativo: true, tipo: 'Principal', codigoInterno: 'P01', codigoBarras: '7890000002', nome: 'Pizza Calabresa M', preco: 45.00, custo: 20.00, unidadeMedida: 'UN', grupoProdutoId: 2, imagem: 'https://picsum.photos/200/200?random=2' },
  { id: 3, ativo: true, tipo: 'Principal', codigoInterno: 'B01', codigoBarras: '7890000003', nome: 'Coca-Cola 2L', preco: 12.00, custo: 7.50, unidadeMedida: 'UN', grupoProdutoId: 3, imagem: 'https://picsum.photos/200/200?random=3' },
  { id: 4, ativo: true, tipo: 'Principal', codigoInterno: 'PT01', codigoBarras: '7890000004', nome: 'Batata Frita G', preco: 18.00, custo: 8.00, unidadeMedida: 'POR', grupoProdutoId: 4, imagem: 'https://picsum.photos/200/200?random=4' },
  
  // Açaí Scenario
  { id: 5, ativo: true, tipo: 'Principal', codigoInterno: 'AC300', codigoBarras: '7890000005', nome: 'Açaí 300ml', preco: 15.00, custo: 5.00, unidadeMedida: 'UN', grupoProdutoId: 5 },
  { id: 6, ativo: true, tipo: 'Principal', codigoInterno: 'AC500', codigoBarras: '7890000006', nome: 'Açaí 500ml', preco: 22.00, custo: 8.00, unidadeMedida: 'UN', grupoProdutoId: 5 },
  
  // Complementos
  { id: 100, ativo: true, tipo: 'Complemento', codigoInterno: 'AD01', codigoBarras: '', nome: 'Leite Ninho', preco: 3.00, custo: 0.50, unidadeMedida: 'POR', grupoProdutoId: 6 },
  { id: 101, ativo: true, tipo: 'Complemento', codigoInterno: 'AD02', codigoBarras: '', nome: 'Granola', preco: 2.00, custo: 0.30, unidadeMedida: 'POR', grupoProdutoId: 6 },
  { id: 102, ativo: true, tipo: 'Complemento', codigoInterno: 'AD03', codigoBarras: '', nome: 'Paçoca', preco: 2.00, custo: 0.30, unidadeMedida: 'POR', grupoProdutoId: 6 },
  { id: 103, ativo: true, tipo: 'Complemento', codigoInterno: 'AD04', codigoBarras: '', nome: 'Morango', preco: 4.00, custo: 1.00, unidadeMedida: 'POR', grupoProdutoId: 6 },
  { id: 104, ativo: true, tipo: 'Complemento', codigoInterno: 'AD05', codigoBarras: '', nome: 'Banana', preco: 2.00, custo: 0.50, unidadeMedida: 'POR', grupoProdutoId: 6 },
];

export const INITIAL_ADDON_CONFIGS: ConfiguracaoAdicional[] = [
  // Açaí 300ml: 3 Free items
  { id: 1, produtoPrincipalId: 5, cobrarApartirDe: 3, complementosIds: [100, 101, 102, 103, 104] },
  // Açaí 500ml: 5 Free items
  { id: 2, produtoPrincipalId: 6, cobrarApartirDe: 5, complementosIds: [100, 101, 102, 103, 104] }
];

export const INITIAL_CLIENTS: Cliente[] = [
  { 
    id: 1, 
    tipoPessoa: 'Física',
    nome: 'João Silva', 
    cpfCnpj: '123.456.789-00',
    telefone: '(11) 99999-9999', 
    endereco: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Apto 101'
  },
  { 
    id: 2, 
    tipoPessoa: 'Física',
    nome: 'Maria Oliveira', 
    cpfCnpj: '987.654.321-99',
    telefone: '(11) 98888-8888', 
    endereco: 'Av. Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    complemento: ''
  },
];

// Helper to simulate DB operations
class MockDbContext {
  private caixa: CaixaMovimento[] = [];
  private pedidos: Pedido[] = [];
  private produtos: Produto[] = [...INITIAL_PRODUCTS];
  private grupos: GrupoProduto[] = [...INITIAL_GROUPS];
  private clientes: Cliente[] = [...INITIAL_CLIENTS];
  private formasPagamento: FormaPagamento[] = [...INITIAL_PAYMENT_METHODS];
  private configAdicionais: ConfiguracaoAdicional[] = [...INITIAL_ADDON_CONFIGS];

  constructor() {
    // Seed initial cash opening
    this.addMovimento({
      id: 1,
      data: new Date().toISOString(),
      tipoOperacao: TipoOperacaoCaixa.Abertura,
      valor: 150.00,
      observacao: 'Abertura de Caixa Inicial'
    });
  }

  // --- Caixa ---
  getSaldoCaixa(): number {
    return this.caixa.reduce((acc, mov) => {
      if (mov.tipoOperacao === TipoOperacaoCaixa.Sangria) {
        return acc - mov.valor;
      }
      return acc + mov.valor;
    }, 0);
  }

  addMovimento(movimento: CaixaMovimento) {
    this.caixa.push(movimento);
  }

  getMovimentos() {
    return [...this.caixa].reverse(); // Newest first
  }

  // --- Pedidos ---
  addPedido(pedido: Pedido) {
    this.pedidos.push(pedido);
    if (pedido.status === PedidoStatus.Pago) {
      this.addMovimento({
        id: Math.floor(Math.random() * 10000),
        data: new Date().toISOString(),
        tipoOperacao: TipoOperacaoCaixa.Vendas,
        valor: pedido.total,
        observacao: `Venda #${pedido.id} (${pedido.tipoAtendimento}) - ${pedido.formaPagamentoNome}`
      });
    }
  }

  getPedidos() {
    return [...this.pedidos].reverse();
  }
  
  getVendasDoDia(): number {
      const today = new Date().toDateString();
      return this.pedidos
        .filter(p => new Date(p.data).toDateString() === today && p.status !== PedidoStatus.Cancelado)
        .reduce((acc, p) => acc + p.total, 0);
  }

  // --- Produtos ---
  getProdutos() {
    return [...this.produtos];
  }

  getGrupos() {
    return [...this.grupos];
  }

  saveProduto(produto: Produto) {
    if (produto.id === 0) {
      // Create
      const newId = Math.max(...this.produtos.map(p => p.id), 0) + 1;
      this.produtos.push({ ...produto, id: newId });
    } else {
      // Update
      this.produtos = this.produtos.map(p => p.id === produto.id ? produto : p);
    }
  }

  deleteProduto(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
    // Also delete any addon config for this product if it was a main product
    this.configAdicionais = this.configAdicionais.filter(c => c.produtoPrincipalId !== id);
  }

  // --- Clientes ---
  getClientes() {
    return [...this.clientes];
  }

  saveCliente(cliente: Cliente) {
    if (cliente.id === 0) {
      // Create
      const newId = Math.max(...this.clientes.map(c => c.id), 0) + 1;
      this.clientes.push({ ...cliente, id: newId });
    } else {
      // Update
      this.clientes = this.clientes.map(c => c.id === cliente.id ? cliente : c);
    }
  }

  deleteCliente(id: number) {
    this.clientes = this.clientes.filter(c => c.id !== id);
  }

  // --- Formas de Pagamento ---
  getFormasPagamento() {
    return [...this.formasPagamento];
  }

  saveFormaPagamento(forma: FormaPagamento) {
    if (forma.id === 0) {
      const newId = Math.max(...this.formasPagamento.map(f => f.id), 0) + 1;
      this.formasPagamento.push({ ...forma, id: newId });
    } else {
      this.formasPagamento = this.formasPagamento.map(f => f.id === forma.id ? forma : f);
    }
  }

  deleteFormaPagamento(id: number) {
    this.formasPagamento = this.formasPagamento.filter(f => f.id !== id);
  }

  // --- Configuracao Adicionais ---
  getConfiguracoesAdicionais() {
    return [...this.configAdicionais];
  }
  
  getConfiguracaoByProdutoPrincipal(produtoId: number): ConfiguracaoAdicional | undefined {
    return this.configAdicionais.find(c => c.produtoPrincipalId === produtoId);
  }

  saveConfiguracaoAdicional(config: ConfiguracaoAdicional) {
    if (config.id === 0) {
       const newId = Math.max(...this.configAdicionais.map(c => c.id), 0) + 1;
       this.configAdicionais.push({ ...config, id: newId });
    } else {
       this.configAdicionais = this.configAdicionais.map(c => c.id === config.id ? config : c);
    }
  }

  deleteConfiguracaoAdicional(id: number) {
    this.configAdicionais = this.configAdicionais.filter(c => c.id !== id);
  }
}

export const db = new MockDbContext();