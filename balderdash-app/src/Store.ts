import { createGlobalState } from 'react-hooks-global-state';
import { FEPlayer, FrontEndData } from "./server/BalderdashGame";
import { WAITING_STATE } from "./server/shared";

const {setGlobalState, useGlobalState} = createGlobalState(
{
    "data": new FrontEndData
        (
            WAITING_STATE,
            false,
            false,
            [],
            false,
            [],
            new FEPlayer("Undefined", 0, false)
        ),
    "roomCode": ""
}
);

const setStoreState = (data : FrontEndData) => {
    setGlobalState("data", data);
}

const GetStoreState = () : FrontEndData => {
    return useGlobalState("data")[0];
}

const setRoomCode = (roomCode : string) => {
    setGlobalState("roomCode", roomCode);
}

const GetRoomCode = () : string => {
    return useGlobalState("roomCode")[0];
}

export { GetStoreState, setStoreState, setRoomCode, GetRoomCode };