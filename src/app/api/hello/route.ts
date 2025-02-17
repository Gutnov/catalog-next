import { NextResponse } from 'next/server'

async function GET(request: Request) {
    return new NextResponse('Hello world from api!')
}

export { GET }
