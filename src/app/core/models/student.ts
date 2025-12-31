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