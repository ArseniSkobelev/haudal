import Helper from "../utils/helper";

export default class ServiceController {
    public async clearCollections(callback: any): Promise<any> {
        const helper = new Helper();
        helper.clearCollections((err: any, res: any) => {
            return callback(err, res);
        });
    }
}