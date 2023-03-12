import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { MessageBox } from '../../components/aws-message-box/message-box.component';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class HubConnectionService {

  connection!: HubConnection;

  constructor(
    public authenticationService: AuthenticationService,
  ) {
    this.initConnection();
  }

  initConnection() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.hub_url, {
        accessTokenFactory: () => this.authenticationService.getAccessToken(),
      })
      .build();

    this.listenEvents();
  }

  connectHub(callback?: Function) {
    const self = this;
    this.connection.start()
      .then(() => {
        console.log('SignalR connected');
        if (callback) {
          callback();
        }
      })
      .catch(error => {
        console.log('SignalR connect failed');
        setTimeout(() => {
          self.connectHub();
        }, 5000);
      });
  }

  closeHub() {
    if (this.connection && this.connection.state == HubConnectionState.Connected) {
      this.connection.stop();
    }
  }

  listenEvents() {
    this.onMessageReceived();
    this.onClose();
  }

  onMessageReceived() {
    this.connection.on('messageReceived', message => {
      console.log(`MessageRecevied[${this.connection.connectionId}]`, message);
    });
  }

  onClose() {
    this.connection.onclose( response => {
      MessageBox.information(new Message(self, { content: "Hub connection is disconnected!" }));
    });
  }

  sendMessage(message: string) {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      const userId = this.authenticationService.getUserId();
      this.connection.invoke("SendMessageAsync", userId, message);

    } else {
      this.connectHub(() => this.sendMessage(message));
    }
  }
}
