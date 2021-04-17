import * as allController from '../controllers/main.controller';
import mainElements from '../../main';

export function socketMain(socket){
    // console.log('conectado');

    //Luz
    socket.on('updateLuzState', (data) => { //{id: 'xx', name: '', chipId: '', state: true/false}
        allController.updateLuzStateNameSocket(data);
        mainElements.ioObject.sockets.emit('updateLuzState', data);
    });  

    socket.on("disconnect", (reason) => {
        // console.log('disconnected');
    });
}