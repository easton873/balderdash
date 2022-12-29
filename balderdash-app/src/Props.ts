export interface Props{
    socket: any;
}

export interface NavProps extends Props{
    navFunc: () => void;
}