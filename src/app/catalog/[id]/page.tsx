"use client"

import { useParams } from 'next/navigation'

export default function CompanyPage() {
    const {id} = useParams()
    
    return (
        <div>
            <h1 className='text-xl font-bold'>Company {id}</h1>
        </div>
    )
}
