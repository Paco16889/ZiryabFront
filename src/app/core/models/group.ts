export interface Group {
    id: number,
    name: string,
    createdAt: string
}

// request para crear un grupo
export interface GroupCreateRequest {
  name: string;
}

// response después de crear un grupo
export interface GroupCreateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    createdAt: string;
  };
}
