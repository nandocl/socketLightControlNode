import SerialPort from 'serialport';
import Delimiter from '@serialport/parser-delimiter'

const serialPort = new SerialPort("COM5", { baudRate: 9600 });
const serialportReader = serialPort.pipe(new Delimiter({delimiter: '\n'}));

serialportReader.on('data', (data) => {
    data = data.toString('utf8');
    // console.log(data);
});

export function serialPortWrite(data){
    serialPort.write(data + '\n');
}