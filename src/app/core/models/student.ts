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
    isActive: boolean;
    createdAt:string,
}
//creacion interfaz usuario para el registro 



export interface StudentByIdResponse {
  success: boolean;
  data: Student;

  
}

export interface StudentsAllResponse {
  success: boolean;
  data: Student[];
  count: number;
  // No hay count en este caso
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
    isActive: boolean;
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
  //isActive: boolean;
}

export interface StudentUpdateRequest {
  id: number;
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
  //isActive: boolean;
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
    //isActive: boolean;
  };
  

  
}

export interface StudentDeleteResponse{
    success: boolean;
  }