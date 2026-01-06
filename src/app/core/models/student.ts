export interface Student {
    id:number,
    email:string,
    name:string,
    surname:string,
    ndSurname:string,
    birthDate:string,
    dni: string,
    role: string;
    firebaseUID: string;
    createdAt:string,
}
//creacion interfaz usuario para el registro 



export interface StudentByIdResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
    createdAt: string;
  };

  
}

export interface StudentCreateResponse{
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
    createdAt: string;
  };
  }

export interface StudentCreateRequest{
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
  role?: string;
}

export interface StudentUpdateRequest {
  id: number;
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
}

export interface StudentUpdateResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
    createdAt: string;
  };
  

  
}

export interface StudentDeleteResponse{
    success: boolean;
  }