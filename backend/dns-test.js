import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.promises.resolveSrv("_mongodb._tcp.cluster0.yix9snz.mongodb.net")
    .then((result) => {
        console.log("MongoDB SRV resolved:");
        console.log(result);
    })
    .catch((error) => {
        console.log("DNS error:");
        console.log(error);
    });