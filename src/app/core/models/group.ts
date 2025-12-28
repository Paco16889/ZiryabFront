export interface Group {
    id: number,
    name: string,
    createdAt: string
}

export interface GroupsAllResponse{
  succes: boolean;
  data:{
    id: number,
    name: string,
    createdAt: string
  }[];
  count: number;
}
export interface GroupByIdResponse {
  success: boolean;
  data:{
    id: number,
    name: string,
    createdAt: string
  };

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


export interface GroupDeleteResponse{
  succes: boolean;
  message: string;
  deletedId: number;
}

export interface GroupUpdateResponse{
  succes: boolean;
  data: {
    id: number;
    name: string;
  }
}

export interface GroupUpdateRequest{
  id: number;
  name: string;
}