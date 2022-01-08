import { Component } from '@angular/core';
import { HelloReply, HelloRequest } from 'src/generated/greet_pb';
import { GreeterClient, ServiceError } from 'src/generated/greet_pb_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GrpcWebClient';
  response: string='';
  responseMessage: HelloReply = new HelloReply();
  
  ngOnInit(): void {
    const client = new GreeterClient('https://localhost:7031');
    const req = new HelloRequest();
    req.setName("World! this request from angular App");
    client.sayHello(req, (error: ServiceError|null, responseMessage)=> {
      if (error) {
        this.response = error.message;
        return;
      }
      if (responseMessage != null)
        this.response = responseMessage.getMessage();
    })
  }
}
