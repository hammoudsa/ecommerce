export class Usuario {
    constructor(
         public email: string,
         public nome_completo: string,
         public nome_usuario: string,
         public senha: string,
         public listaSeguidores: any,
         public isArtist: boolean,
         public genero: string
    ){}

}