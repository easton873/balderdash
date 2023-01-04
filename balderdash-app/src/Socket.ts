import io from 'socket.io-client';

export class Socket{
    private static _instance : Socket;

    private _socket : any;

    private constructor(){
        this._socket = io();
        // for development use line below and comment out line above
        // this._socket = io('http://localhost:8080');
    }

    public static init(){
        this._instance = new Socket();
    }

    public static get instance(){
        if (!this._instance){
            this.init();
        }
        return this._instance
    }

    public get socket(){
        return this._socket;
    }
}