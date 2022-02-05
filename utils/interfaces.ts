export interface Board {
  board_id: string;
  board_title: string;
  board_limit: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardWithDocId extends Board {
  doc_id: string;
}

export interface List {
  list_id: string;
  list_title: string;
  board_id: string;
  createdAt: string;
}

export interface Item {
  item_id: string;
  item_title: string;
  item_order: number;
  board_id: string;
  list_id: string;
  item_upvotes: number;
  createdAt: string;
}
