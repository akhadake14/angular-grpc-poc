using GreeterGrpcService;
using Grpc.Net.Client;

var channel = GrpcChannel.ForAddress("https://localhost:7031");
var client = new Greeter.GreeterClient(channel);

var response = await client.SayHelloAsync(
    new HelloRequest { Name = "World" });

Console.WriteLine(response.Message);
