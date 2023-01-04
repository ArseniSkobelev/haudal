import PingController from "../controllers/ping";

test('should return pong message and success should be true', async () => {
    const controller = new PingController();
    const response = await controller.getMessage();
    expect(response.message).toBe('Pong!');
    expect(response.success).toBe(true);
});