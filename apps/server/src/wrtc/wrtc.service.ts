import { Injectable } from '@nestjs/common'
import wrtc from 'wrtc'
@Injectable()
export class WrtcService {
  createConnection() {
    return new wrtc.RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    })
  }
}
