// Enums mirroring the requested C# logic
export enum TipoAtendimento {
  VendaRapida = 'Venda Rápida',
  Delivery = 'Delivery',
  Retirada = 'Retirada',
  Encomenda = 'Encomenda'
}

export enum TipoOperacaoCaixa {
  Abertura = 'Abertura',
  Reforco = 'Reforço',
  Sangria = 'Sangria',
  Vendas = 'Venda',
  Fechamento = 'Fechamento'
}

export enum PedidoStatus {
  Pendente = 'Pendente',
  Pago = 'Pago',
  Entregue = 'Entregue',
  Cancelado = 'Cancelado'
}

// Entities (Models)
export interface Cliente {
  id: number;
  tipoPessoa: 'Física' | 'Jurídica';
  nome: string;
  cpfCnpj: string;
  telefone: string;
  // Address breakdown
  endereco: string; // Logradouro
  numero: string;
  complemento: string;
  bairro: string;
  cep?: string;
  cidade?: string;
}

export interface GrupoProduto {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  ativo: boolean; // Status
  codigoInterno: string;
  codigoBarras: string;
  nome: string;
  preco: number;
  custo: number;
  unidadeMedida: string; // 'UN', 'KG', 'LT'
  grupoProdutoId: number;
  imagem?: string;
}

export interface PedidoItem {
  produto: Produto;
  quantidade: number;
}

export interface Pedido {
  id: number;
  data: string; // ISO String
  tipoAtendimento: TipoAtendimento;
  clienteId?: number;
  clienteNome?: string; // Denormalized for display
  total: number;
  status: PedidoStatus;
  itens: PedidoItem[];
}

export interface CaixaMovimento {
  id: number;
  data: string;
  tipoOperacao: TipoOperacaoCaixa;
  valor: number;
  observacao: string;
}