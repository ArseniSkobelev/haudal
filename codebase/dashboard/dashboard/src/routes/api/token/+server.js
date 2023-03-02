// @ts-nocheck
import { error } from "@sveltejs/kit"
import { BASE_URL } from '$env/static/private'

export const POST = async ({ request }) => {
    const body = await request.json();

    const result = await fetch(`${BASE_URL}/token/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": request.headers.get("authorization")
        },
        body: JSON.stringify(body)
    })

    let api_response = await result.json()

    return new Response(JSON.stringify({
        status: api_response.status,
        message: api_response.message,
        key: api_response.key
    }))
}

export const GET = async ({ request }) => {
    const result = await fetch(`${BASE_URL}/token`, {
        method: "GET",
        headers: {
            "Authorization": request.headers.get("authorization")
        }
    })

    let apiKeys = await result.json()

    return new Response(JSON.stringify(apiKeys))
}