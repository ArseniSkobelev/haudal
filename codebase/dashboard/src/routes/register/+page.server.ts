import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { SECRET_BASE_URL } from '$env/static/private';

export const actions: Actions = {
    default: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const error = "Internal server error"

        if (!formData.email || !formData.password) {
            return fail(422, { error: "Username or password is missing" })
        }

        const response = await fetch(`${SECRET_BASE_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": formData.email,
                "password": formData.password
            })
        })

        const jsonResponse = await response.json();


        if (jsonResponse.is_authorized) {
            throw redirect(302, "/login")
        } else {
            return fail(jsonResponse.status, { error: `Message: ${jsonResponse.message}` })
        }
    }
}