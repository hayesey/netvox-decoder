/*
 * Example decoder for some Netvox sensors with The Things Network
 * FOR TESTING PURPOSES ONLY
 * Paul Hayes - paul@alliot.co.uk
 */

function Decoder(bytes, fport) {
    var decoded = {};
    if (fport === 6) { // then its ReportDataCmd
	if (bytes[2] === 0x00) { // version report
	    decoded.softwareversion = bytes[3]
	    decoded.hardwareversion = bytes[4]
	    decoded.datecode = bcdtonumber(bytes.slice(5,9))
	    return decoded
	}
  	if ((bytes[1] === 0x01) && (bytes[2] === 0x01)) { // device type 01 (R711/712) and report type 01
    	    decoded.battery = bytes[3]/10
      	    decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5])/100
      	    decoded.humidity = ((bytes[6] << 8) + bytes[7])/100
    	} else if ((bytes[1] === 0x02) && (bytes[2] === 0x01)) { // device type 02 (R311A), report type 01
      	    decoded.battery = bytes[3]/10
      	    decoded.contact = bytes[4]
    	} else if ((bytes[1] === 0x06) && (bytes[2] === 0x01)) { // device type 06 (R311W)
    	    decoded.battery = bytes[3]/10
            decoded.leakone = bytes[4]
            decoded.leaktwo = bytes[5]
    	} else if ((bytes[1] === 0x13) && (bytes[2] === 0x01)) { // device type 13 (R718AB)
            decoded.battery = bytes[3]/10
      	    decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5])/100
      	    decoded.humidity = ((bytes[6] << 8) + bytes[7])/100
        } else if ((bytes[1] === 0x16) && (bytes[2] === 0x01)) { // device type 13 (R718CK2)
            decoded.battery = bytes[3]/10
      	    decoded.temperature1 = ((bytes[4] << 24 >> 16) + bytes[5])/10
      	    decoded.temperature2 = ((bytes[6] << 24 >> 16) + bytes[7])/10
        } else if ((bytes[1] === 0x0E) && (bytes[2] === 0x01)) { // device type 0E (R809A) and report type 01
      	    decoded.state = bytes[3]
      	    decoded.kwhused = ((bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] << 8) + bytes[7])/1000
    	} else if ((bytes[1] === 0x0E) && (bytes[2] === 0x02)) { // device type 0E (R809A), report type 02
      	    decoded.volts = ((bytes[3] << 8) + bytes[4])
      	    decoded.amps = ((bytes[5] << 8) + bytes[6])/1000
      	    decoded.watts = ((bytes[7] << 8) + bytes[8])
    	} else if ((bytes[1] === 0x03) && (bytes[2] === 0x01)) { // device type 0E (RB11E), report type 01
      	    decoded.battery = bytes[3]/10
      	    decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5])/100
      	    decoded.illuminance = ((bytes[6] << 8) + bytes[7])
            decoded.occupied = bytes[8]
    	} else if ((bytes[1] === 0x05) && (bytes[2] === 0x07)) {  // device R72615A, CO2 report type
            decoded.battery = bytes[3]/10
            if ((bytes[4] != 0xff) || (bytes[5] != 0xff)) { // sometimes see ffff as co2 data?!?
	        decoded.co2 = ((bytes[4] << 8) + bytes[5])/10
            }
            // the rest of the message is 0xff for other sensor types
        } else if ((bytes[1] === 0x05) && (bytes[2] === 0x0C)) { // device R72615A, temp & humidity report
            decoded.battery = bytes[3]/10
	    decoded.temperature = ((bytes[4] << 24 >> 16) + bytes[5])/100
            decoded.humidity = ((bytes[6] << 8) + bytes[7])/100
            // the rest of the message is 0xff for other sensor types
        } else if ((bytes[1] === 0x1B) && (bytes[2] === 0x01)) { // device R718DB and report 01
            decoded.battery = bytes[3]/10
            decoded.vibration = bytes[4]
        } else if ((bytes[1] === 0x49) && (bytes[2] === 0x01)) { // device type 49 (R718N1) and report type 01
	    decoded.battery = bytes[3]/10
	    decoded.currentma = ((bytes[4] << 8) + bytes[5])
	    decoded.multiplier = bytes[6]
	    decoded.realcurrentma = decoded.currentma * decoded.multiplier
	} else if ((bytes[1] === 0x32) && (bytes[2] === 0x01)) { // device type 32 (R718WA), report type 01
	    decoded.battery = bytes[3]/10
	    decoded.waterleak = bytes[4]
	} else if ((bytes[1] === 0x4D) && (bytes[2] === 0x01)) { // device type 4D (R312A), report type 01
	    decoded.battery = bytes[3]/10
	    decoded.alarm = bytes[4]
	}
    } else if (fport === 7) { // then its a ConfigureCmd response
    	if ((bytes[0] === 0x82) && (bytes[1] === 0x01)) { // R711 or R712
      	    decoded.mintime = ((bytes[2] << 8) + bytes[3])
      	    decoded.maxtime = ((bytes[4] << 8) + bytes[5])
      	    decoded.battchange = bytes[6]/10
      	    decoded.tempchange = ((bytes[7] << 8) + bytes[8])/100
      	    decoded.humidchange = ((bytes[9] << 8) + bytes[10])/100
    	} else if ((bytes[0] === 0x81) && (bytes[1] === 0x01)) { // R711 or R712
      	    decoded.success = bytes[2]
    	}
    }
    return decoded
}

function bcdtonumber(bytes) {
    var num = 0
    var m = 1
    var i
    for (i = 0; i<bytes.length; i++) {
        num += (bytes[bytes.length-1-i] & 0x0F) * m;
        num += ((bytes[bytes.length-1-i]>>4) & 0x0F) * m * 10;
        m *= 100;
    }
    return num;
}
