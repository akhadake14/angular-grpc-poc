# angular-grpc-poc


#Referance blog : https://blog.vitas.nl/using_grpc_web_with_.net_core_and_angular.html

# 1. Create the gRPC service
  For the service I have used the default "gRPC Service" project provided by Visual Studio.

  Start Visual Studio and select Create a new project.

  After creating this project, you will have an GreeterService which can communicate by gRPC.

  Add the **Grpc.AspNetCore.Web** NuGet package to enable gRPC-Web (don't forget to check the "Include prerelease" box)Add Nuget

  And configure the app to use gRPC-Web by adding the UseGrpcWeb() middleware and .EnableGrpcWeb() to your service in the startup file:

  Startup.cs
  ````
  
  public void Configure(IApplicationBuilder app)
  {
      app.UseRouting();

      // Add gRPC-Web middleware after routing and before endpoints
      app.UseGrpcWeb();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapGrpcService<GreeterService>().EnableGrpcWeb();
      });
  }
````

# 2 Call the gRPC-Web service from an Angular app
  Now that we created the server part, we need to create a client to communicate with the server.  
  
  For the demo we create a new Angular app 
  >ng-cli command :ng new GrpcWebClient
  
  Because the communication between client and server is defined in a .proto file we can generate the client code for the service.
  For this to work we need to add 2 packages to our Angular project

  >npm install ts-protoc-gen
  >
  >npm install google-protobuf @types/google-protobuf @improbable-eng/grpc-web --save
  
  And we need to download the [protoc tool](https://github.com/protocolbuffers/protobuf/releases/)

  I have downloaded the "protoc-3.11.4-win64.zip" and copied the protoc.exe and google folder to a new "Protoc" folder (next to my GrpcWebClient folder)

  Content of Protoc folder

  To generate the client code I copied the greet.proto from the .NET project to the Protoc folder and used this command

  >protoc 
    --plugin="protoc-gen-ts=C:\Repos\GrpcWeb-dotNetCore-Angular\GrpcWebClient\node_modules\.bin\protoc-gen-ts.cmd" 
    --js_out="import_style=commonjs,binary:../GrpcWebClient/src/generated" 
    --ts_out="service=grpc-web:../GrpcWebClient/src/generated" greet.proto
  After running this command, it will generate 4 files in my '/GrpcWebClient/src/generated' folder (the 'generated' folder needs to be created by hand).

  Now we can add a greeter component by using this command

  >ng g component greeter
  >
  Call the Greeter service from Angular
  greater.compontent.ts
  
  ````
  
  export class GreeterComponent implements OnInit {
  
    response: string;
    ngOnInit(): void {
      const client = new GreeterClient('https://localhost:5001');
      const req = new HelloRequest();
      req.setName("World!");
      client.sayHello(req, (err: ServiceError, response: HelloReply) => {
        if (err) {
          this.response = `Error: {err.message}`;
          return;
        }
        this.response = response.getMessage();
      });
    }
  }
  ````
