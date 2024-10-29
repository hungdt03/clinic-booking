import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../utils/auth";
import { MessageRequest, MessageResource } from ".";

const URL = "http://localhost:5175/serverHub";

class Connector {

    private connection: signalR.HubConnection;
    public events: (
        onMessageReceived?: (message: MessageResource) => void,
    ) => void;

    static instance: Connector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                skipNegotiation: true, // prevent warning | error when using diffenrent domain with server
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: async () => getAccessToken() ?? '',
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start().catch(err => console.log(err));

        this.events = (onMessageReceived) => {
            this.connection.on("NewMessage", (message: MessageResource) => {
                onMessageReceived?.(message);
            });
        };
    }

    public sendMessage = async (message: MessageRequest) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("SendMessage", message)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }

    }

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;