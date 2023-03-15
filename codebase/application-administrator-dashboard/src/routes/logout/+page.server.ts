import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (events) => {
    if (events.cookies.get("Authorization") != undefined) {
        await events.cookies.set("Authorization", "", {
            path: "/",
            expires: new Date(0),
        })

        throw redirect(302, "/login")
    }

    throw redirect(302, "/login")
}