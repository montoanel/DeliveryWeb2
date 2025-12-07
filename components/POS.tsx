import React, { useState, useEffect } from 'react';
import { Produto, PedidoItem, Cliente, TipoAtendimento, PedidoStatus, Pedido } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS, db } from '../services/mockDb';
import { 
  Search, Plus, Trash2, User, Truck, ShoppingBag, 
  ClipboardList, Zap, Save, X, Calculator, Calendar 
} from 'lucide-react';

const POS: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [orders, setOrders] = useState<Pedido[]>([]);
  
  // --- Form State ---
  const [currentOrderType, setCurrentOrderType] = useState<TipoAtendimento>(TipoAtendimento.VendaRapida);
  const [cart, setCart] = useState<PedidoItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [observation, setObservation] = useState('');
  
  // Search States
  const [productSearch, setProductSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // --- Data Loading ---
  const refreshOrders = () => {
    setOrders(db.getPedidos());
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  // --- Handlers ---

  const handleNewOrder = (type: TipoAtendimento) => {
    setCurrentOrderType(type);
    setCart([]);
    setSelectedClient(null);
    setObservation('');
    setProductSearch('');
    setView('form');
  };

  const handleAddItem = (product: Produto) => {
    setCart(prev => {
      const existing = prev.find(item => item.produto.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.produto.id === product.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...prev, { produto: product, quantidade: 1 }];
    });
    setProductSearch(''); // Clear search to continue scanning/typing
  };

  const handleRemoveItem = (productId: number) => {
    setCart(prev => prev.filter(item => item.produto.id !== productId));
  };

  const handleSaveOrder = () => {
    if (cart.length === 0) {
      alert("O pedido precisa ter pelo menos um item.");
      return;
    }

    if ((currentOrderType === TipoAtendimento.Delivery || currentOrderType === TipoAtendimento.Encomenda) && !selectedClient) {
      alert("Para este tipo de atendimento, o Cliente é obrigatório.");
      return;
    }

    const total = cart.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

    const newPedido: Pedido = {
      id: Math.floor(Math.random() * 10000) + 1000, // Mock ID
      data: new Date().toISOString(),
      tipoAtendimento: currentOrderType,
      clienteId: selectedClient?.id,
      clienteNome: selectedClient?.nome || 'Consumidor Final',
      total: total,
      status: PedidoStatus.Pendente, // Default status
      itens: cart
    };

    db.addPedido(newPedido);
    refreshOrders();
    setView('list');
    alert(`Atendimento ${newPedido.id} salvo com sucesso!`);
  };

  // --- Derived State ---
  const filteredProducts = productSearch.length > 0 
    ? INITIAL_PRODUCTS.filter(p => p.nome.toLowerCase().includes(productSearch.toLowerCase()) || p.codigoBarras.includes(productSearch) || p.codigoInterno.toLowerCase().includes(productSearch.toLowerCase()))
    : [];

  const filteredClients = INITIAL_CLIENTS.filter(c => 
    c.nome.toLowerCase().includes(clientSearch.toLowerCase()) || c.id.toString() === clientSearch
  );

  const cartTotal = cart.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

  // --- Render Helpers ---

  const getStatusColor = (status: PedidoStatus) => {
    switch(status) {
      case PedidoStatus.Pago: return 'bg-green-100 text-green-700';
      case PedidoStatus.Pendente: return 'bg-yellow-100 text-yellow-700';
      case PedidoStatus.Cancelado: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Top Action Buttons (Legacy Style) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 tracking-wider">Novo Atendimento</h2>
          <div className="flex flex-wrap gap-4">
            
            <button onClick={() => handleNewOrder(TipoAtendimento.Encomenda)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95">
              <ClipboardList size={24} />
              <span>Encomenda</span>
            </button>

            <button onClick={() => handleNewOrder(TipoAtendimento.Retirada)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95">
              <ShoppingBag size={24} />
              <span>Retirada</span>
            </button>

            <button onClick={() => handleNewOrder(TipoAtendimento.Delivery)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95">
              <Truck size={24} />
              <span>Delivery</span>
            </button>

            <button onClick={() => handleNewOrder(TipoAtendimento.VendaRapida)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95">
              <Zap size={24} />
              <span>V. Rápida</span>
            </button>

          </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-bold">Todos</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-bold cursor-pointer hover:bg-gray-300">Abertos</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Hoje</span>
             </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase">Tipo</th>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase">ID</th>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase">Data/Hora</th>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase">Cliente</th>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase text-right">Total (R$)</th>
                <th className="p-3 text-xs font-bold text-gray-600 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="p-3 text-sm font-medium text-gray-700">{order.tipoAtendimento}</td>
                  <td className="p-3 text-sm text-gray-500">{order.id}</td>
                  <td className="p-3 text-sm text-gray-500">{new Date(order.data).toLocaleString()}</td>
                  <td className="p-3 text-sm text-gray-700">{order.clienteNome}</td>
                  <td className="p-3 text-sm font-bold text-gray-800 text-right">{order.total.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-10 text-center text-gray-400">Nenhum atendimento encontrado hoje.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- FORM VIEW (NOVO ATENDIMENTO) ---
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-100 -m-4 p-4">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-t-lg shadow-sm border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           <span className="text-blue-600">#{Math.floor(Math.random() * 1000)}</span> 
           Novo Atendimento
        </h2>
        <div className="flex gap-2">
            <button onClick={() => setView('list')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={handleSaveOrder} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save size={18} /> Salvar (F5)
            </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 mt-4 overflow-hidden">
        
        {/* Main Form Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            
            {/* Header Info Block */}
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                        <input type="text" value={currentOrderType} disabled className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-gray-700 font-bold" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Atendente</label>
                        <input type="text" value="2 - Admin" disabled className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-gray-700" />
                    </div>
                     <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente (F2)</label>
                        <div className="flex gap-1">
                             <input 
                                type="text" 
                                placeholder="Buscar Cliente..." 
                                value={selectedClient ? selectedClient.nome : clientSearch}
                                onChange={(e) => {
                                    setClientSearch(e.target.value);
                                    setSelectedClient(null);
                                }}
                                className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none ${selectedClient ? 'bg-blue-50 font-bold text-blue-800' : 'bg-white'}`}
                             />
                             <button className="px-3 bg-gray-200 rounded border border-gray-300 text-gray-600 hover:bg-gray-300"><Search size={16}/></button>
                        </div>
                        {/* Client Dropdown */}
                        {clientSearch && !selectedClient && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg max-h-40 overflow-auto z-50">
                                {filteredClients.map(c => (
                                    <div 
                                        key={c.id} 
                                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50"
                                        onClick={() => {
                                            setSelectedClient(c);
                                            setClientSearch('');
                                        }}
                                    >
                                        <b>{c.id}</b> - {c.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                    <input 
                        type="text" 
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
            </div>

            {/* Product Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
                <div className="mb-4 relative">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adicionar Produto (Nome ou Código)</label>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Digite para buscar..." 
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button className="px-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Buscar</button>
                     </div>
                     
                     {/* Product Dropdown */}
                     {productSearch && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl max-h-60 overflow-auto z-50 mt-1 rounded-md">
                            {filteredProducts.map(p => (
                                <div 
                                    key={p.id} 
                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center group"
                                    onClick={() => handleAddItem(p)}
                                >
                                    <div>
                                        <div className="font-bold text-gray-800">{p.nome}</div>
                                        <div className="text-xs text-gray-500">Cód: {p.codigoInterno} | Estoque: 99 {p.unidadeMedida}</div>
                                    </div>
                                    <div className="text-blue-600 font-bold">R$ {p.preco.toFixed(2)}</div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="p-4 text-center text-gray-400 text-sm">Nenhum produto encontrado</div>
                            )}
                        </div>
                     )}
                </div>

                {/* Data Grid */}
                <div className="flex-1 border border-gray-200 rounded overflow-auto bg-gray-50">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="p-2 text-xs font-bold text-gray-600 uppercase w-20">Código</th>
                                <th className="p-2 text-xs font-bold text-gray-600 uppercase">Produto</th>
                                <th className="p-2 text-xs font-bold text-gray-600 uppercase w-20 text-center">Qtd</th>
                                <th className="p-2 text-xs font-bold text-gray-600 uppercase w-32 text-right">Preço Unit.</th>
                                <th className="p-2 text-xs font-bold text-gray-600 uppercase w-32 text-right">Total</th>
                                <th className="p-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cart.map((item, index) => (
                                <tr key={item.produto.id} className="hover:bg-blue-50">
                                    <td className="p-2 text-sm text-gray-500">{item.produto.codigoInterno}</td>
                                    <td className="p-2 text-sm font-medium text-gray-800">{item.produto.nome}</td>
                                    <td className="p-2 text-sm text-center">
                                        <input 
                                            type="number" 
                                            value={item.quantidade} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if(val > 0) {
                                                    setCart(prev => prev.map(i => i.produto.id === item.produto.id ? {...i, quantidade: val} : i));
                                                }
                                            }}
                                            className="w-16 border rounded text-center p-1"
                                        />
                                    </td>
                                    <td className="p-2 text-sm text-right">R$ {item.produto.preco.toFixed(2)}</td>
                                    <td className="p-2 text-sm font-bold text-right text-blue-700">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => handleRemoveItem(item.produto.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {cart.length === 0 && (
                                <tr>
                                   <td colSpan={6} className="p-10 text-center text-gray-300">
                                      Use a busca acima para adicionar produtos
                                   </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Sidebar Totals */}
        <div className="w-80 flex flex-col gap-4">
             <div className="bg-white p-6 rounded-lg shadow-sm h-40 flex flex-col justify-center items-end border border-gray-200">
                  <span className="text-gray-500 font-medium uppercase text-sm mb-1">Total Líquido</span>
                  <span className="text-4xl font-extrabold text-blue-700">R$ {cartTotal.toFixed(2)}</span>
             </div>

             <div className="bg-white p-4 rounded-lg shadow-sm flex-1 border border-gray-200 space-y-2">
                 <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Calculator size={18} /> Resumo Financeiro
                 </h3>
                 <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Subtotal</span>
                     <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Descontos</span>
                     <span className="font-medium text-red-500">R$ 0,00</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Acrescimos</span>
                     <span className="font-medium text-green-500">R$ 0,00</span>
                 </div>
                 <div className="border-t border-gray-100 my-2 pt-2">
                     <div className="flex justify-between font-bold text-lg">
                         <span>Total</span>
                         <span>R$ {cartTotal.toFixed(2)}</span>
                     </div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default POS;