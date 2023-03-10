import { redirect } from "@sveltejs/kit";
import UserApiKeyStore from "../lib/stores/UserApiKeyStore";
import type { PageServerLoad } from "./$types";
UserApiKeyStore.subscribe((data) => {
    console.log(data);
});

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/login")
    } else {
        UserApiKeyStore.set([{ "name": "test", "test": "yes2" }])
    }
}