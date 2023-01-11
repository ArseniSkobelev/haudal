interface PingResponse {
    success: boolean,
    message: string;
}

export default class PingController {
    public async getMessage(): Promise<PingResponse> {
        return {
            success: true,
            message: "Pong!",
        };
    }
}