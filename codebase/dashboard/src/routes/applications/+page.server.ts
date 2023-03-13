import { SECRET_BASE_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
    if (!locals.user) {
        throw redirect(303, "/login")
    } else {
        let jwt = cookies.get("Authorization");

        if (jwt) {
            let apiResponse = await fetch(`${SECRET_BASE_URL}/token`, {
                method: "GET",
                headers: {
                    "Authorization": jwt
                }
            })

            const apiResponseJson = await apiResponse.json();


            if (apiResponseJson.api_keys) {
                return { api_keys: apiResponseJson.api_keys }
            } else {
                return { api_keys: [] }
            }
        }
    }
}