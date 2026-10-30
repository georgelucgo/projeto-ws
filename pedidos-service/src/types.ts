
export interface Pedido {
  id: number;
  produtoId: number;
  quantidade: number;
  clienteEmail: string;
  total: number;
  status: string;
  notificacaoStatus: string;
}
