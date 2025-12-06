// import LocalSource from "@/datasource/controller/message.controller";
import {getRequest} from "@/services/axios.service";

// async function getMessagesFromLocalSource(idSender){
//     return LocalSource.getMessagesController(idSender);
// }

async function getMessagesFromAPI(idReceiver,idSender){
    return getRequest(`messages/conversation/${idReceiver}/${idSender}`,"")
}

async function getMessagesService(idReceiver,idSender){
    let result =null;
    try {
        // result = await getMessagesFromLocalSource(idSender);
        result = await getMessagesFromAPI(idReceiver,idSender);

    }catch (e){
        result = {error: 1, status: 404, data: 'erreur rÃ©seau, impossible de rÃ©cupÃ©rer les messages'  }
    }
    return result.data;
}





export default {
    getMessagesService,

}